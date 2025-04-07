<script lang="ts">
	import { Chart, type ChartTypeRegistry } from 'chart.js/auto';
	import { onMount } from 'svelte';

	interface Props extends CommonProps {
		type: keyof ChartTypeRegistry;
	}

	const { labels, datasets, type, width, height }: Props = $props();
	let canvas: HTMLCanvasElement;

	onMount(() => {
		new Chart(canvas, {
			type,
			data: {
				labels,
				datasets
			}
		});
	});
</script>

<canvas bind:this={canvas} {width} {height}></canvas>
