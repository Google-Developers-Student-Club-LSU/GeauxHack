<script lang="ts">
	let { src, alt }: { src: string; alt: string } = $props();

	let naturalWidth = $state(0);
	let naturalHeight = $state(0);
	let markFit = $derived(
		Math.min(0.92, naturalWidth > 0 ? Math.sqrt(naturalHeight / naturalWidth) : 0.6)
	);
</script>

<span class="logo-mark logo-mark-mono">
	<img {src} {alt} bind:naturalWidth bind:naturalHeight style="--mark-fit: {markFit}" />
</span>
