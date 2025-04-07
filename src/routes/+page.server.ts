import { WORD_LIST_PATHS, ATTEMPTS_PER_SECOND, MAX_ENTROPY_SCALE } from '$env/static/private';
import { Logger } from '$lib/server/Logger';
import { PasswordCheck } from '$lib/server/PasswordCheck';
import { error } from '@sveltejs/kit';

const logger = Logger.make('sys');

export const actions = {
	default: async ({ request, locals }) => {
		const password = (await request.formData()).get('password')?.toString();
		if (!password) {
			logger.error('No password was provided');
			error(400, 'You must provide a password to check');
		}

		const pwdCheck = new PasswordCheck(password);

		const entropy = pwdCheck.entropy().entropy;
		const wordlist = WORD_LIST_PATHS.split(',')
			.map((path) => pwdCheck.wordlist(path))
			.find((list) => list.has(password));
		const inWordList = Boolean(wordlist);
		const score =
			((Math.min(entropy || 0, +MAX_ENTROPY_SCALE) / +MAX_ENTROPY_SCALE) * 100) / (+inWordList + 1);
		const estimatedSeconds =
			(wordlist ? wordlist.length : Math.pow(2, entropy)) / (+ATTEMPTS_PER_SECOND * score);

		await locals.stats.incrPwdChecks(password, entropy, score, estimatedSeconds, wordlist?.path);
		locals.stats.logger().debug('Password checked', {
			statsId: locals.stats.id,
			password,
			entropy,
			inWordList,
			score,
			estimatedSeconds
		});

		return {
			entropy,
			inWordList,
			score,
			estimatedSeconds
		};
	}
};
