<script lang="ts">
	import Base from './Base.svelte';

	const { datasets, width, height }: CommonProps = $props();
</script>

<Base type="bubble" {datasets} {width} {height} />
