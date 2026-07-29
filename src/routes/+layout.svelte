<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';

  import 'lenis/dist/lenis.css';
 
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import type { Snippet } from 'svelte';
  import Lenis from 'lenis';
  import Snap from 'lenis/snap';
 
  let lenis: Lenis | undefined;
 
  onMount(() => {
    if (!browser) return;
 
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 
    lenis = new Lenis({
      duration: 2, // higher = slower / glidier scroll (Lenis default is ~1.2)
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
 
    const snap = new Snap(lenis, {
      type: 'mandatory',
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out cubic
      velocityThreshold: 0.6
    });
    snap.addElements(document.querySelectorAll('main > section'), { align: ['start'] });
 
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });
 
  onDestroy(() => {
    lenis?.destroy();
  });

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
