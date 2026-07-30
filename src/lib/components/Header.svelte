<script lang="ts">
  import type Lenis from 'lenis';

  let { lenis }: { lenis?: Lenis } = $props();

  let mobileOpen = $state(false);

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Tracks', href: '#tracks' },
    { label: 'Sponsors', href: '#sponsors' },
    { label: 'FAQ', href: '#faq' }
  ];

  const HEADER_OFFSET = -80;

  function goTo(event: MouseEvent, href: string) {
    event.preventDefault();
    mobileOpen = false;

    if (lenis) {
      lenis.scrollTo(href, { offset: HEADER_OFFSET });
    } else {
      document.querySelector(href)?.scrollIntoView();
    }
  }
</script>

<header class="fixed inset-x-0 top-0 z-50 border-b border-sand/10 bg-slate/70 backdrop-blur-md">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
    <a href="#home" onclick={(e) => goTo(e, '#home')} class="text-lg font-bold tracking-wide text-amber">
        GeauxHack '26
    </a>

    <nav class="hidden items-center gap-8 md:flex">
      {#each links as link}
        <a
          href={link.href}
          onclick={(e) => goTo(e, link.href)}
          class="text-sm font-semibold text-sand/80 transition hover:text-amber"
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-4">
      <a
        href="#apply"
        onclick={(e) => goTo(e, '#apply')}
        class="hidden rounded-full bg-crimson px-5 py-2 text-sm font-semibold text-sand transition hover:bg-rust sm:inline-block"
      >
        Apply
      </a>

      <button
        type="button"
        onclick={() => (mobileOpen = !mobileOpen)}
        class="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        <span
          class="h-0.5 w-6 rounded-full bg-sand transition-transform"
          class:rotate-45={mobileOpen}
          class:translate-y-2={mobileOpen}
        ></span>
        <span class="h-0.5 w-6 rounded-full bg-sand transition-opacity" class:opacity-0={mobileOpen}></span>
        <span
          class="h-0.5 w-6 rounded-full bg-sand transition-transform"
          class:-rotate-45={mobileOpen}
          class:-translate-y-2={mobileOpen}
        ></span>
      </button>
    </div>
  </div>

  {#if mobileOpen}
    <nav class="flex flex-col gap-1 border-t border-sand/10 bg-slate/95 px-6 py-4 md:hidden">
      {#each links as link}
        <a
          href={link.href}
          onclick={(e) => goTo(e, link.href)}
          class="rounded-md px-3 py-3 text-sm font-semibold text-sand/90 transition hover:bg-sand/10 hover:text-amber"
        >
          {link.label}
        </a>
      {/each}
      <a
        href="#apply"
        onclick={(e) => goTo(e, '#apply')}
        class="mt-2 rounded-full bg-crimson px-5 py-3 text-center text-sm font-semibold text-sand"
      >
        Apply
      </a>
    </nav>
  {/if}
</header>