<script lang="ts">
	import Base from './Base.svelte';

	const { labels, datasets, width, height }: CommonProps = $props();
</script>

<Base type="doughnut" {labels} {datasets} {width} {height} />
