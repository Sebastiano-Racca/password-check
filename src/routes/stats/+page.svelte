<script lang="ts">
	import Bubble from '$lib/components/chart/Bubble.svelte';
	import Doughnut from '$lib/components/chart/Doughnut.svelte';
	import Scatter from '$lib/components/chart/Scatter.svelte';
	import VisitsChart from '$lib/components/VisitsChart.svelte';
	import type { PwdCheck } from '@prisma/client';
	import { UAParser } from 'ua-parser-js';

	const { data } = $props();
	const { stats } = data;

	const osCounter: { [key: string]: number } = {};
	const browserCounter: { [key: string]: number } = {};

	stats
		.flatMap((stat) => stat.pageVisits)
		.forEach((visit) => {
			const parser = new UAParser();
			parser.setUA(visit.userAgent || '');

			const os = parser.getOS().name || 'OS Sconosciuto';
			const browser = parser.getBrowser().name || 'Browser Sconosciuto';

			osCounter[os] = (osCounter[os] || 0) + 1;
			browserCounter[browser] = (browserCounter[browser] || 0) + 1;
		});

	const symlog = (value: number, scalingFactor = 1, threshold = 1) => {
		if (Math.abs(value) <= threshold) {
			return value * scalingFactor;
		}
		return Math.sign(value) * Math.log10(Math.abs(value));
	};

	const pwdDataset = stats
		.flatMap((s) => s.pwdChecks)
		.reduce(
			(acc, curr) => {
				acc[!curr.wordlist ? 0 : 1].push(curr);
				return acc;
			},
			[[], []] as PwdCheck[][]
		)
		.map((ds, index) => {
			return {
				label: Boolean(index) ? 'Dentro una wordlist' : 'Passsword',
				data: ds.map((check) => {
					return {
						x: check.entropy,
						y: check.score,
						r: symlog(check.estimatedSeconds, 2000)
					};
				})
			};
		});

	const pwdUsage = Object.entries(
		stats
			.flatMap((s) => s.pwdChecks)
			.reduce(
				(acc, curr) => {
					acc[curr.password] = {
						score: curr.score,
						count: (acc[curr.password]?.count || 0) + 1
					};

					return acc;
				},
				{} as Record<string, { count: number; score: number }>
			)
	).map(([_, obj]) => {
		return {
			x: obj.score,
			y: obj.count
		};
	});
</script>

<header>
	<h1>Statistiche di Utilizzo</h1>
	<p>
		Queste statistiche sono create sulla base dei dati forniti dagli utenti per sensibilizzare gli
		stessi all'uso consapevole degli strumenti online.
	</p>
</header>

<section>
	<div>
		<VisitsChart days={30} {stats} />
	</div>

	<div id="ua">
		<div>
			<h2>Sistemi Operativi Utilizzati</h2>
			<Doughnut labels={Object.keys(osCounter)} datasets={[{ data: Object.values(osCounter) }]} />
		</div>

		<div>
			<h2>Browser Utilizzati</h2>
			<Doughnut
				labels={Object.keys(browserCounter)}
				datasets={[{ data: Object.values(browserCounter) }]}
			/>
		</div>
	</div>
</section>

<section>
	<h2>Efficacia delle Password</h2>
	<div class="pwd">
		<Bubble height={100} datasets={pwdDataset} />
	</div>
	<ul>
		<li><strong>Asse X:</strong> Entropia della password</li>
		<li><strong>Asse Y:</strong> Punteggio di sicurezza (da 0 a 100)</li>
		<li>
			<strong>Grandezza della bolla:</strong> Tempo stimato per il cracking (scala logaritmica in base
			10, con fattore di scala 2000)
		</li>
		<li>
			<strong>Colore della bolla:</strong> Rosso indica che la password è presente in una wordlist nota
		</li>
	</ul>
</section>

<section>
	<h2>Password più usate</h2>
	<div class="pwd">
		<Scatter height={100} datasets={[{ label: 'Password', data: pwdUsage }]} />
	</div>

	<ul>
		<li><strong>Asse X:</strong> Score della password</li>
		<li><strong>Asse Y:</strong> Quante volte è stata usata</li>
	</ul>
</section>

<style lang="scss">
	header,
	section {
		text-align: center;
	}

	.pwd {
		height: 50vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0;
	}

	p {
		margin-top: 0;
	}

	div {
		margin: 10px 40px;
		text-align: center;

		&#ua {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-around;
			margin: 0;

			div {
				margin: 0;
			}
		}
	}

	ul {
		display: table;
		margin: auto;
		margin-bottom: 30px;
		text-align: left;
		li {
			list-style: none;
		}
	}
</style>
