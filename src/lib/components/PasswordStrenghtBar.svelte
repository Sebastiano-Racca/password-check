<script lang="ts">
	const { score = $bindable() }: { score: number } = $props();
</script>

<div class="strength-bar">
	<div
		class="bar {score < 50 ? 'weak' : score < 80 ? 'medium' : 'strong'}"
		style="width: {score}%"
	></div>
</div>

<style>
	.strength-bar {
		height: 10px;
		width: 100%;
		background: #ddd;
		border-radius: 5px;
		margin-top: 5px;
		overflow: hidden;
	}
	.bar {
		height: 100%;
		width: 0%;
		transition: width 0.3s ease-in-out;
		border-radius: 5px;
	}
	.weak {
		background: red;
	}
	.medium {
		background: orange;
	}
	.strong {
		background: green;
	}
</style>
