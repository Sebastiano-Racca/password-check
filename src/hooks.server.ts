import { STATS_COOKIE_NAME } from '$env/static/private';
import { Logger } from '$lib/server/Logger';
import { Statistics } from '$lib/server/Statistics';
import { error } from '@sveltejs/kit';

const logger = Logger.make('sys');

export const handle = async ({ event, resolve }) => {
	const { cookies, locals } = event;

	const cookie = cookies.get(STATS_COOKIE_NAME);

	if (cookie) {
		if (!(await Statistics.exists(cookie))) {
			logger.warn(`The given cookie is not valid`, { cookie_name: STATS_COOKIE_NAME, cookie });
			error(400, 'Bad cookie');
		}

		locals.stats = new Statistics(cookie);
	}

	if (!cookie) {
		locals.stats = await Statistics.createInstance();
		cookies.set(STATS_COOKIE_NAME, locals.stats.id, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: true
		});

		locals.stats.logger().info('New user', { statsId: locals.stats.id });
	}

	if (event.request.method === 'GET') {
		const ua = event.request.headers.get('user-agent') || undefined;
		await locals.stats.incrPageVisit(event.url.pathname, ua);
		locals.stats
			.logger()
			.info('Page visit', { statsId: locals.stats.id, page: event.url.pathname, userAgent: ua });
	}

	return await resolve(event);
};
