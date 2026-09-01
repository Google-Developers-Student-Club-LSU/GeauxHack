<script lang="ts">
	import './layout.css';

	import 'lenis/dist/lenis.css';
	import Lenis from 'lenis';
	import Snap from 'lenis/snap';

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	import Header from '$lib/components/Header.svelte';

	let { children }: { children: Snippet } = $props();

	let lenis: Lenis | undefined = $state(undefined);

	onMount(() => {
		if (!browser) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		lenis = new Lenis({
			duration: 2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true
		});

		if (window.innerWidth >= 768) {
			const snap = new Snap(lenis, {
				type: 'mandatory',
				duration: 1.1,
				easing: (t: number) => 1 - Math.pow(1 - t, 3)
			});
			snap.addElements(Array.from(document.querySelectorAll<HTMLElement>('main > section')), {
				align: ['start']
			});
		}

		function raf(time: number) {
			lenis?.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);
	});

	onDestroy(() => {
		lenis?.destroy();
	});
</script>

<svelte:head>
	<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>
<Header {lenis} />
{@render children()}
