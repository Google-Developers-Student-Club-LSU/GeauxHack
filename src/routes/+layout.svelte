<script lang="ts">
	import './layout.css';

	import type { Snippet } from 'svelte';

	import Header from '$lib/components/Header.svelte';

	let { children }: { children: Snippet } = $props();

</script>

<svelte:head>
	<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>
<Header />
{@render children()}
