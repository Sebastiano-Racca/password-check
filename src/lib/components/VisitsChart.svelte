<script lang="ts">
	import type { PageVisit, PwdCheck } from '@prisma/client';
	import Line from './chart/Line.svelte';

	const {
		stats,
		days
	}: { stats: { pageVisits: PageVisit[]; pwdChecks: PwdCheck[] }[]; days: number } = $props();

	const uniqueVisitors = stats.length;
	const pageViews = stats.flatMap((stat) => stat.pageVisits).length;
	const passwordChecks = stats.flatMap((s) => s.pwdChecks).length;

	const dateToString = (date: Date) => {
		return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
	};

	const lastDays = Array.from({ length: days }, (_, i) => {
		const d = new Date();
		d.setDate(d.getDate() - i);
		return dateToString(d);
	}).reverse();

	const visitCounts = stats
		.flatMap((s) => s.pageVisits)
		.reduce<
			Record<string, Record<string, number>>
		>((acc, curr) => (((acc[curr.page] ??= {})[`${String(curr.date.getDate()).padStart(2, '0')}/${String(curr.date.getMonth() + 1).padStart(2, '0')}/${curr.date.getFullYear()}`] = (acc[curr.page][`${String(curr.date.getDate()).padStart(2, '0')}/${String(curr.date.getMonth() + 1).padStart(2, '0')}/${curr.date.getFullYear()}`] || 0) + 1), acc), {});

	const pwdChecks = stats
		.flatMap((s) => s.pwdChecks)
		.reduce(
			(acc, curr) => {
				const date = dateToString(curr.date);
				acc[date] = (acc[date] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

	const visitsDatasets = Object.keys(visitCounts).map((page) => {
		const data = lastDays.map((date) => visitCounts[page][date] || 0);
		return { label: page, data };
	});

	const pwdDataset = {
		label: 'Password Controllate',
		fill: true,
		data: lastDays.map((date) => pwdChecks[date] || 0)
	};
</script>

<div>
	<h2>Richieste negli Ultimi 30 gg</h2>
	<article id="stats">
		<h3>Visitatori Univoci: {uniqueVisitors}</h3>
		<h3>Pagine Visitate: {pageViews}</h3>
		<h3>Password Controllate: {passwordChecks}</h3>
	</article>

	<article id="chart">
		<Line height={300} labels={lastDays} datasets={[pwdDataset, ...visitsDatasets]} />
	</article>
</div>

<style lang="scss">
	h2 {
		margin-bottom: 0;
	}

	#stats {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0 20px;

		h3 {
			background-color: rgba(0, 0, 0, 0.2);
			padding: 5px 10px;
			border-radius: 10px;
			margin-bottom: 5px;
		}
	}

	#chart {
		margin-top: 20px;
		height: 50vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
