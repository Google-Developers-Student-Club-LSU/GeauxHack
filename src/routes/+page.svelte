<script lang="ts">
  import { reveal } from '$lib/reveal';

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

</script>

<main class="relative bg-geaux-slate text-geaux-sand">
  <section
    id="about"
    class="flex h-dvh w-full flex-col items-center justify-center overflow-y-auto px-6 md:px-10"
  >
    <div
      use:reveal
      class="relative mx-auto max-w-3xl rounded-2xl border border-geaux-amber/30 bg-geaux-crimson/10 p-10 text-center md:p-14"
    >
      <div class="mx-auto mb-8 h-40 w-40 rounded-full border-2 border-dashed border-geaux-sand/30"></div>

      <h1 class="text-4xl font-bold text-geaux-amber md:text-5xl">About</h1>
      <p class="mt-5 max-w-prose text-geaux-sand/90 md:text-lg">
        hackathon
      </p>
      <p class="mt-3 text-sm text-geaux-sand/60">
        Any logistics note (housing, dates, capacity) goes here.
      </p>

      <button class="mt-10 rounded-full bg-geaux-crimson px-8 py-3 font-semibold text-geaux-sand transition hover:bg-geaux-rust">
        Apply Now
      </button>
    </div>
  </section>

  <section
    id="tracks"
    class="flex h-dvh w-full flex-col items-center justify-center overflow-y-auto px-6 md:px-10"
  >
    <div class="mx-auto max-w-6xl">
      <h2 use:reveal class="text-center text-4xl font-bold text-geaux-amber md:text-5xl">Tracks</h2>
 
      <div class="mt-16 flex flex-wrap justify-center gap-6">
        {#each tracks as track, i}
          <div
            use:reveal={{ delay: i * 80 }}
            class="flex w-52 flex-col items-center gap-3 rounded-xl border border-geaux-sand/20 bg-geaux-slate/60 p-7 text-center"
          >
            <div class="h-20 w-20 rounded-full border-2 border-dashed border-geaux-amber/40"></div>
            <p class="font-semibold text-geaux-sand">{track.name}</p>
            <p class="text-sm text-geaux-sand/60">{track.category}</p>
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
      <h2 use:reveal class="text-4xl font-bold text-geaux-amber md:text-5xl">Sponsors</h2>
      <p use:reveal={{ delay: 80 }} class="mt-6 text-geaux-sand/70">Coming soon.</p>
 
      <div class="mt-14 flex flex-wrap justify-center gap-6">
        {#each Array(4) as _, i}
          <div
            use:reveal={{ delay: i * 70 }}
            class="flex h-20 w-40 items-center justify-center rounded-lg border border-dashed border-geaux-sand/20 text-sm text-geaux-sand/40"
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
      <h2 use:reveal class="text-center text-4xl font-bold text-geaux-amber md:text-5xl">FAQ</h2>

      <div class="mt-16 space-y-4">
        {#each faqs as faq, i}
          <details
            use:reveal={{ delay: i * 60 }}
            class="group rounded-lg border border-geaux-sand/20 bg-geaux-slate/60 p-5 open:bg-geaux-slate/80"
          >
            <summary class="cursor-pointer list-none font-semibold text-geaux-sand marker:hidden">
              {faq.question}
            </summary>
            <p class="mt-3 text-sm text-geaux-sand/70">{faq.answer}</p>
          </details>
        {/each}
      </div>
    </div>
  </section>

</main>