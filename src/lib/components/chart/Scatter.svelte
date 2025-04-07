<script lang="ts">
	import Base from './Base.svelte';

	const { datasets, width, height }: CommonProps = $props();
</script>

<Base
	type="scatter"
	{datasets}
	{width}
	{height}
	options={{ scales: { x: { type: 'linear', position: 'bottom' } } }}
/>
