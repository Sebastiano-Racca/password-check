<script lang="ts">
	import { enhance } from '$app/forms';
	import PasswordStrenghtBar from '$lib/components/PasswordStrenghtBar.svelte';
	import { Duration } from 'luxon';

	let { form } = $props();

	let score = $derived(form?.score);
	let estimatedSeconds = $derived(form?.estimatedSeconds);
</script>

<main>
	<section>
		<h1>Quanto è sicura la tua password?</h1>

		<form
			method="post"
			use:enhance={() =>
				({ result }) => {
					if (result.type === 'success') {
						score = result.data?.score as number;
						estimatedSeconds = result.data?.estimatedSeconds as number;
					}
				}}
		>
			<input type="password" name="password" id="password" required />
			<button type="submit">Test Password</button>
		</form>

		{#if score}
			<p>Punteggio: {score.toFixed(2)}%</p>
			<PasswordStrenghtBar bind:score />
		{/if}

		{#if estimatedSeconds}
			<p>
				Tempo stimato per il "cracking":
				{Duration.fromObject({
					years: 0,
					months: 0,
					days: 0,
					hours: 0,
					minutes: 0,
					seconds: estimatedSeconds
				})
					.normalize()
					.reconfigure({ locale: 'it' })
					.toHuman()}
			</p>
		{/if}
	</section>

	<section>
		<h2>Rendere una password sicura</h2>

		<ul>
			<li>
				<b>Requisiti minimi</b>: Crea una password di almeno 12 caratteri con minuscole, maiuscole,
				numeri e simboli
			</li>
			<li>
				<b>Sostituizioni ovvie</b>: Non sostituire una “E” con un “3” o un “5” con un “$”, gli
				hacker conoscono questa pratica e non renderà la password più sicura.
			</li>
			<li>
				<b>Informazioni pubbliche</b>: non mettere il nome del tuo cane o la tua data di nascita,
				sono informazioni facilmente ottenibili
			</li>
		</ul>
	</section>

	<section>
		<h2>Gli errori più comuni sulle password</h2>

		<article>
			<img src="/img/reused-passwords.png" alt="Password Riusate" />
			<div>
				<h3>Riusi le tue password</h3>
				<p>
					Riutilizzare le stesse password su più siti è estremamente pericoloso. Se un sito viene
					compromesso, tutti gli altri account con la stessa password sono a rischio.
				</p>
			</div>
		</article>

		<article>
			<img src="/img/easy-passwords.png" alt="Password Facili" />
			<div>
				<h3>Password Facili da indovinare</h3>
				<p>
					Usare password facili da indovinare, come '123456' o 'password', rende il tuo account un
					facile bersaglio per gli hacker.
				</p>
			</div>
		</article>

		<article>
			<img src="/img/no-mfa.png" alt="No MFA" />
			<div>
				<h3>Non Usi l'Autenticazione a più fattori</h3>
				<p>
					L'autenticazione a più fattori (MFA) aggiunge un ulteriore livello di sicurezza
					richiedendo un secondo metodo di verifica oltre alla password.
				</p>
			</div>
		</article>

		<article>
			<img src="/img/save-passwords.png" alt="Ti ricordi" />
			<div>
				<h3>Ti ricordi le password</h3>
				<p>Se ti puoi ricordare la tua password anche un computer può.</p>
			</div>
		</article>

		<article>
			<img src="/img/giving-away.png" alt="Password Regalate" />
			<div>
				<h3>Regali le tue password</h3>
				<p>
					Condividere le password con amici o colleghi può esporre il tuo account a rischi di
					sicurezza. Non inserire le tue password in siti simili a questo.
				</p>
			</div>
		</article>
	</section>
</main>

<style lang="scss">
	main {
		line-height: 1.6;
		padding: 20px;
		section {
			background: white;
			padding: 20px;
			margin: 20px auto;
			border-radius: var(--border-radius);
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
			max-width: 800px;

			h1,
			h2 {
				color: var(--primary-color);
				text-align: center;
			}

			form {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 10px;

				input {
					&[type='password'] {
						padding: 10px;
						width: 100%;
						max-width: 400px;
						border: 1px solid #ccc;
						border-radius: var(--border-radius);
						transition: var(--transition);

						&:focus {
							border-color: var(--primary-color);
							outline: none;
							box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
						}
					}
				}

				button {
					padding: 10px 20px;
					border: none;
					background: var(--primary-color);
					color: white;
					font-size: 1rem;
					border-radius: var(--border-radius);
					cursor: pointer;
					transition: var(--transition);

					&:hover {
						background: #357abd;
					}
				}
			}

			ul {
				list-style: none;
				padding: 0;

				li {
					background: var(--secondary-color);
					margin: 10px 0;
					padding: 10px;
					border-radius: var(--border-radius);
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}
			}

			article {
				display: flex;
				align-items: center;
				// gap: 20px;
				background: white;
				padding: 15px;
				border-radius: var(--border-radius);
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				margin-bottom: 15px;

				img {
					width: 50px;
					height: 50px;
					margin-right: 15px;
					padding: 10px 20px;
				}
			}
		}
	}
</style>
