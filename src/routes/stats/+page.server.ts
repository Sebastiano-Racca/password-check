import { env } from '$env/dynamic/private';
import { Statistics } from '$lib/server/Statistics';
import { error } from '@sveltejs/kit';

const { STATS_PASSWORD } = env;

export const load = async ({ request, setHeaders }) => {
	if (STATS_PASSWORD) {
		const auth = request.headers.get('authorization');
		if (
			!auth ||
			Buffer.from(auth.split(' ')[1], 'base64').toString().split(':')[1] !== STATS_PASSWORD
		) {
			setHeaders({ 'WWW-Authenticate': 'Basic realm="Statistiche", charset="UTF-8"' });
			error(401, 'Devi prima autenticarti');
		}
	}

	return {
		stats: await Statistics.getAll()
	};
};
