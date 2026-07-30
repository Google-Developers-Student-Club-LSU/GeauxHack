<script lang="ts">
  import { reveal } from '$lib/reveal';
  import { onMount } from 'svelte';

  interface Track {
    name: string;
    category: string;
  }

  interface Faq {
    question: string;
    answer: string;
  }

  const tracks: Track[] = [
    { name: 'Track One', category: 'Category' },
    { name: 'Track Two', category: 'Category' },
    { name: 'Track Three', category: 'Category' },
  ];

  const faqs: Faq[] = [
    { question: 'What is a hackathon?', answer: 'blank' },
    { question: 'Who can come?', answer: 'blank' },
    { question: 'What does it cost?', answer: 'blank' },
    { question: "What if I don't have a team?", answer: 'blank' }
  ];

  const HACKATHON_START = new Date('2026-10-22T00:00:00-05:00');

  let now = $state(new Date());

  onMount(() => {
    const interval = setInterval(() => {
      now = new Date();
    }, 1000);
    return () => clearInterval(interval);
  });

  let remainingMs = $derived(Math.max(0, HACKATHON_START.getTime() - now.getTime()));
  let days = $derived(Math.floor(remainingMs / (1000 * 60 * 60 * 24)));
  let hours = $derived(Math.floor((remainingMs / (1000 * 60 * 60)) % 24));
  let minutes = $derived(Math.floor((remainingMs / (1000 * 60)) % 60));
  let seconds = $derived(Math.floor((remainingMs / 1000) % 60));

  let countdownParts = $derived([
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds }
  ]);

  const GDG_RSVP_URL = 'https://gdg.community.dev/events/details/google-gdg-on-campus-louisiana-state-university-presents-geauxhack-2026-lsu/';

  let applyForm = $state({
    name: '',
    email: '',
    team: '',
    year: '',
    track: '',
    division: '',
    shirtSize: '',
    dietaryRestriction: ''
  });

  let submitting = $state(false);
  let applyError = $state('');

  async function handleApplySubmit(event: SubmitEvent) {
    event.preventDefault();
    applyError = '';
    submitting = true;

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applyForm)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        applyError = data?.error ?? 'Something went wrong. Please try again.';
        return;
      }

      window.location.href = GDG_RSVP_URL;
    } catch {
      applyError = 'Something went wrong. Please try again.';
    } finally {
      submitting = false;
    }
  }
</script>

<main class="relative bg-slate text-sand">
  <section
    id="home"
    class="flex h-dvh w-full flex-col items-center justify-center overflow-y-auto px-6 text-center md:px-10"
  >
    <div use:reveal class="mx-auto max-w-3xl">
      <div class="mx-auto mb-10 flex h-56 w-56 items-center justify-center rounded-full border-2 border-dashed border-sand/30 text-sm text-sand/40"></div>

      <h1 class="glow-amber font-display text-5xl font-bold text-amber md:text-7xl">GeauxHack '26</h1>
      <p class="font-mono-retro mt-4 text-xs uppercase tracking-[0.3em] text-sand/70 md:text-sm">T-minus</p>

      <div class="mt-10 flex items-center justify-center gap-3 sm:gap-6">
        {#each countdownParts as part}
          <div class="flex flex-col items-center gap-2 rounded-md border border-amber/30 bg-slate/80 px-4 py-3 sm:px-6 sm:py-4">
            <span class="font-mono-retro glow-amber text-3xl font-bold text-amber sm:text-5xl">{part.value.toString().padStart(2, '0')}</span>
            <span class="font-mono-retro text-[0.65rem] uppercase tracking-[0.25em] text-sand/60">{part.label}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section
    id="about"
    class="flex h-dvh w-full flex-col items-center justify-center overflow-y-auto px-6 md:px-10"
  >
    <div
      use:reveal
      class="relative mx-auto max-w-3xl rounded-2xl border border-amber/30 bg-crimson/10 p-10 text-center md:p-14"
    >
      <div class="mx-auto mb-8 h-40 w-40 rounded-full border-2 border-dashed border-sand/30"></div>

      <h1 class="font-display text-4xl font-bold text-amber md:text-5xl">About</h1>
      <p class="mt-5 max-w-prose text-sand/90 md:text-lg">
        hackathon
      </p>
      <p class="mt-3 text-sm text-sand/60">
        Any logistics note (housing, dates, capacity) goes here.
      </p>

      <a
        href="#apply"
        class="font-display mt-10 inline-block rounded-full bg-crimson px-8 py-3 font-semibold text-sand transition hover:bg-rust"
      >
        Apply Now
      </a>
    </div>
  </section>

  <section
    id="tracks"
    class="flex h-dvh w-full flex-col items-center justify-center overflow-y-auto px-6 md:px-10"
  >
    <div class="mx-auto max-w-6xl">
      <h2 use:reveal class="text-center font-display text-4xl font-bold text-amber md:text-5xl">Tracks</h2>

      <div class="mt-16 flex flex-wrap justify-center gap-6">
        {#each tracks as track, i}
          <div
            use:reveal={{ delay: i * 80 }}
            class="flex w-52 flex-col items-center gap-3 rounded-xl border border-sand/20 bg-slate/60 p-7 text-center"
          >
            <div class="h-20 w-20 rounded-full border-2 border-dashed border-amber/40"></div>
            <p class="font-semibold text-sand">{track.name}</p>
            <p class="font-mono-retro text-xs uppercase tracking-[0.15em] text-sand/60">{track.category}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section
    id="sponsors"
    class="flex h-dvh w-full flex-col items-center justify-center overflow-y-auto px-6 text-center md:px-10"
  >
    <div class="mx-auto max-w-6xl">
      <h2 use:reveal class="font-display text-4xl font-bold text-amber md:text-5xl">Sponsors</h2>
      <p use:reveal={{ delay: 80 }} class="mt-6 text-sand/70">Coming soon.</p>

      <div class="mt-14 flex flex-wrap justify-center gap-6">
        {#each Array(4) as _, i}
          <div
            use:reveal={{ delay: i * 70 }}
            class="flex h-20 w-40 items-center justify-center rounded-lg border border-dashed border-sand/20 text-sm text-sand/40"
          >
            Logo
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section
    id="faq"
    class="flex h-dvh w-full flex-col items-center justify-center overflow-y-auto px-6 md:px-10"
  >
    <div class="mx-auto w-full max-w-5xl">
      <h2 use:reveal class="text-center font-display text-4xl font-bold text-amber md:text-5xl">FAQ</h2>

      <div class="mt-16 space-y-4">
        {#each faqs as faq, i}
          <details
            use:reveal={{ delay: i * 60 }}
            class="group rounded-lg border border-sand/20 bg-slate/60 p-5 open:bg-slate/80"
          >
            <summary class="cursor-pointer list-none font-semibold text-sand marker:hidden">
              {faq.question}
            </summary>
            <p class="mt-3 text-sm text-sand/70">{faq.answer}</p>
          </details>
        {/each}
      </div>
    </div>
  </section>

  <section
    id="apply"
    class="flex h-dvh w-full flex-col items-center justify-center overflow-y-auto px-6 md:px-10"
  >
    <div use:reveal class="mx-auto w-full max-w-xl rounded-2xl border border-amber/30 bg-crimson/10 p-10 md:p-14">
      <h2 class="text-center font-display text-4xl font-bold text-amber md:text-5xl">Apply</h2>
      <p class="mt-4 text-center text-sm text-sand/70">
        Once you have filled out the form, you will be taken to the GDG RSVP page to complete registration.
      </p>

      <form onsubmit={handleApplySubmit} class="mt-8 flex flex-col gap-5">
        <div>
          <label for="apply-name" class="font-mono-retro block text-xs uppercase tracking-[0.15em] text-sand">Name</label>
          <input
            id="apply-name"
            type="text"
            required
            bind:value={applyForm.name}
            class="mt-1 w-full rounded-md border-sand/20 bg-slate/60 text-sand focus:border-amber focus:ring-amber"
          />
        </div>

        <div>
          <label for="apply-email" class="font-mono-retro block text-xs uppercase tracking-[0.15em] text-sand">Email</label>
          <input
            id="apply-email"
            type="email"
            required
            bind:value={applyForm.email}
            class="mt-1 w-full rounded-md border-sand/20 bg-slate/60 text-sand focus:border-amber focus:ring-amber"
          />
        </div>

        <div>
          <label for="apply-team" class="font-mono-retro block text-xs uppercase tracking-[0.15em] text-sand">Team Name</label>
          <input
            id="apply-team"
            type="text"
            bind:value={applyForm.team}
            class="mt-1 w-full rounded-md border-sand/20 bg-slate/60 text-sand focus:border-amber focus:ring-amber"
          />
        </div>

        <div>
          <label for="apply-track" class="font-mono-retro block text-xs uppercase tracking-[0.15em] text-sand">Track</label>
          <select
            id="apply-track"
            required
            bind:value={applyForm.track}
            class="mt-1 w-full rounded-md border-sand/20 bg-slate/60 text-sand focus:border-amber focus:ring-amber"
          >
            <option value="" disabled selected>Select track</option>
            {#each tracks as track}
              <option value={track.name}>{track.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="apply-division" class="font-mono-retro block text-xs uppercase tracking-[0.15em] text-sand">Division</label>
          <select
            id="apply-division"
            required
            bind:value={applyForm.division}
            class="mt-1 w-full rounded-md border-sand/20 bg-slate/60 text-sand focus:border-amber focus:ring-amber"
          >
            <option value="" disabled selected>Select division</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label for="apply-shirt-size" class="font-mono-retro block text-xs uppercase tracking-[0.15em] text-sand">Shirt Size</label>
          <select
            id="apply-shirt-size"
            required
            bind:value={applyForm.shirtSize}
            class="mt-1 w-full rounded-md border-sand/20 bg-slate/60 text-sand focus:border-amber focus:ring-amber"
          >
            <option value="" disabled selected>Select size</option>
            <option value="xs">XS</option>
            <option value="s">S</option>
            <option value="m">M</option>
            <option value="l">L</option>
            <option value="xl">XL</option>
            <option value="xxl">XXL</option>
          </select>
        </div>

        <div>
          <label for="apply-dietary" class="font-mono-retro block text-xs uppercase tracking-[0.15em] text-sand">Dietary Restrictions</label>
          <input
            id="apply-dietary"
            type="text"
            placeholder="e.g. vegetarian, nut allergy, none"
            bind:value={applyForm.dietaryRestriction}
            class="mt-1 w-full rounded-md border-sand/20 bg-slate/60 text-sand focus:border-amber focus:ring-amber"
          />
        </div>

        {#if applyError}
          <p class="text-sm text-crimson">{applyError}</p>
        {/if}

        <button
          type="submit"
          disabled={submitting}
          class="font-display mt-4 rounded-full bg-crimson px-8 py-3 font-semibold text-sand transition hover:bg-rust disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Continue to RSVP'}
        </button>
      </form>
    </div>
  </section>
</main>