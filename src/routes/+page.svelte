<script lang="ts">
	import { onMount } from 'svelte';
	import { reveal } from '$lib/reveal';
	import { pulse } from '$lib/pulse';

	interface Faq {
		question: string;
		answer: string;
		teaser: string;
	}

	const faqs: Faq[] = [
		{
			question: 'What is a hackathon?',
			teaser: 'Build something real in one weekend',
			answer:
				'Hackathons are events where you can build new software, hardware, and other creative projects over a weekend. While websites and mobile apps are common hackathon projects, you are encouraged to build anything your imagination inspires. No prior experience is required!'
		},
		{
			question: 'Who can attend?',
			teaser: 'High school + undergrad, every level',
			answer:
				'Our hackathon is open to high school, undergraduate, and graduate students from any school in the United States. Students of all coding backgrounds and experience levels are encouraged to participate. We will have beginner and advanced brackets so you can compete alongside hackers at a similar experience level. Anyone interested in helping as a volunteer or mentor is also welcome.'
		},
		{
			question: 'How much does it cost?',
			teaser: 'Free - food and snacks included',
			answer:
				'Nothing! The hackathon is completely free to attend and participate in. We will provide food, drinks, and snacks throughout the hackathon at no cost to participants.'
		},
		{
			question: "What if I don't have a team?",
			teaser: 'Find teammates on our Discord',
			answer:
				'Coming solo? No problem! Register individually and find teammates through our Discord team-finding channel. The Discord link will be provided in the registration form.'
		},
		{
			question: 'Will there be food and swag?',
			teaser: 'Yes - shirts if you apply early',
			answer:
				'Yes! All food, drinks, and snacks provided during the hackathon are completely free. Vegetarian options will be available. There are also plenty of dining options in the LSU Student Union, just a short 5-minute walk away. Apply by September 30th to receive a free hackathon T-shirt!'
		},
		{
			question: 'Will travel reimbursement be available?',
			teaser: 'Limited funding for select applicants',
			answer:
				'Travel funding may be available to select participants. If you are interested in receiving travel support, please indicate this on your application. Funding is limited and is not guaranteed for all applicants.'
		}
	];
	interface Sponsor {
		name: string;
		logo?: string;
		url?: string;
	}

	const sponsors: Sponsor[] = [
		{ name: 'Deepspace' },
		{ name: 'lumix' },
		{ name: 'nexus' },
		{ name: 'Google' }
	];

	const clubs: Sponsor[] = [
		{ name: 'GDG on Campus', logo: '/sponsors/gdg.png', url: 'https://gdsclsu.org' },
		{ name: 'SASE LSU', logo: '/sponsors/sase.png', url: 'https://saselsu.org' },
		{ name: 'LSU', logo: '/sponsors/lsu.svg', url: 'https://www.lsu.edu' }
	];

	const HACKATHON_START = new Date('2026-10-23T18:00:00-05:00');
	const FORM_URL = 'https://forms.gle/1nrUX5biKEEkatmx8';
	const MAP_URL =
		'https://www.google.com/maps?q=Patrick+F.+Taylor+Hall,+Baton+Rouge,+LA&output=embed';

	let now = $state(new Date());
	let openFaq = $state<number | null>(null);
	let spaceScene: HTMLElement;

	onMount(() => {
		const interval = window.setInterval(() => {
			now = new Date();
		}, 1000);

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduceMotion || !spaceScene) return () => window.clearInterval(interval);

		const items = Array.from(spaceScene.querySelectorAll<HTMLElement>('[data-parallax]'));
		let frame = 0;
		let scrollY = window.scrollY;
		let scrollVel = 0;

		const update = () => {
			frame = 0;
			const sceneTop = spaceScene.getBoundingClientRect().top + window.scrollY;
			const progress = (scrollY - sceneTop) * 0.08;
			items.forEach((item) => {
				const depth = Number(item.dataset.parallax ?? 1);
				item.style.transform = `translate3d(${Math.sin(scrollY * 0.001 + depth) * depth * 4}px, ${progress * depth}px, 0)`;
			});
		};

		const onScroll = () => {
			const y = window.scrollY;
			scrollVel = y - scrollY;
			scrollY = y;
			if (!frame) frame = window.requestAnimationFrame(update);
		};

		window.addEventListener('scroll', onScroll, { passive: true });

		const flyer = spaceScene.querySelector<HTMLElement>('.hero-flyer');
		let tiltFrame = 0;
		let tiltX = 0;
		let tiltY = 0;
		let bank = 0;
		let targetX = 0;
		let targetY = 0;

		const tiltStep = () => {
			tiltX += (targetX - tiltX) * 0.12;
			tiltY += (targetY - tiltY) * 0.12;
			bank += (Math.max(-1, Math.min(1, scrollVel / 40)) - bank) * 0.07;
			scrollVel *= 0.88;
			if (flyer) {
				const time = performance.now();
				const sway = Math.sin(time / 3600) * 1.9;
				const bob = Math.sin(time / 2600) * 8;
				const glow = 14 + Math.sin(time / 2200) * 8;
				flyer.style.transform = `perspective(950px) rotateY(${(tiltX * 12 + sway * 0.7 + bank * 9).toFixed(2)}deg) rotateX(${(-tiltY * 9).toFixed(2)}deg) rotateZ(${(sway + bank * 5).toFixed(2)}deg) translateY(${bob.toFixed(2)}px)`;
				flyer.style.filter = `drop-shadow(0 0 ${glow.toFixed(1)}px rgba(164, 36, 59, 0.5)) drop-shadow(0 0 52px rgba(164, 36, 59, 0.16)) drop-shadow(0 10px 26px rgba(216, 151, 60, 0.16))`;
			}
			tiltFrame = window.requestAnimationFrame(tiltStep);
		};

		const onStagePointerMove = (event: PointerEvent) => {
			if (!flyer) return;
			const rect = flyer.getBoundingClientRect();
			targetX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
			targetY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
		};

		const onStagePointerLeave = () => {
			targetX = 0;
			targetY = 0;
		};

		let tiltRunning = false;
		const startTilt = () => {
			if (tiltRunning || !flyer) return;
			tiltRunning = true;
			tiltFrame = window.requestAnimationFrame(tiltStep);
		};
		const stopTilt = () => {
			if (!tiltRunning) return;
			tiltRunning = false;
			if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
			tiltFrame = 0;
		};

		let heroObserver: IntersectionObserver | undefined;
		if (flyer) {
			spaceScene.addEventListener('pointermove', onStagePointerMove, { passive: true });
			spaceScene.addEventListener('pointerleave', onStagePointerLeave);
			const hero = spaceScene.querySelector('.hero-section');
			if (hero) {
				heroObserver = new IntersectionObserver(
					(entries) => {
						for (const entry of entries) {
							if (entry.isIntersecting) startTilt();
							else stopTilt();
						}
					},
					{ threshold: 0 }
				);
				heroObserver.observe(hero);
			} else {
				startTilt();
			}
		}

		return () => {
			window.clearInterval(interval);
			window.removeEventListener('scroll', onScroll);
			spaceScene.removeEventListener('pointermove', onStagePointerMove);
			spaceScene.removeEventListener('pointerleave', onStagePointerLeave);
			if (frame) window.cancelAnimationFrame(frame);
			stopTilt();
			heroObserver?.disconnect();
		};
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

	function toggleFaq(index: number) {
		openFaq = openFaq === index ? null : index;
	}
</script>

<svelte:head>
	<title>GeauxHack '26 | LSU</title>
	<meta
		name="description"
		content="GeauxHack '26 is a free student hackathon at LSU on October 23, 2026."
	/>
</svelte:head>

<main bind:this={spaceScene} class="relative bg-slate text-sand">
	<div class="space-object star-field" data-parallax="0.15" aria-hidden="true"></div>
	<div class="space-object planet planet-one" data-parallax="0.55" aria-hidden="true"></div>
	<div class="space-object planet planet-two" data-parallax="0.35" aria-hidden="true"></div>
	<div class="space-object drifting-rocket" data-parallax="0.75" aria-hidden="true">◢</div>
	<section
		id="home"
		class="hero-section section-shell relative isolate flex min-h-dvh flex-col px-6 pt-24 pb-10 md:px-10"
	>
		<div
			class="absolute top-24 -right-24 -z-10 h-64 w-64 rounded-full bg-crimson/20 blur-3xl"
		></div>
		<div
			class="absolute bottom-12 -left-24 -z-10 h-72 w-72 rounded-full bg-amber/10 blur-3xl"
		></div>

		<div class="hero-stage relative isolate flex w-full flex-1 flex-col justify-center">
			<div class="hero-grid absolute inset-0 -z-10"></div>

			<div
				class="hero-layout mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-2 lg:flex-row lg:justify-center lg:gap-14"
			>
				<div class="hero-content w-full max-w-2xl">
					<div use:reveal class="max-w-2xl text-center lg:text-left">
						<p
							class="mb-5 font-mono-retro text-xs tracking-[0.35em] text-sand/70 uppercase md:text-sm"
						>
							LSU · October 23, 2026
						</p>
						<h1
							class="hero-title font-display text-7xl leading-[0.9] font-bold text-sand sm:text-9xl lg:text-[8.75rem]"
						>
							Geaux<span class="text-amber">Hack</span>
							<span class="block text-crimson">'26</span>
						</h1>
						<p class="mt-5 max-w-2xl text-xl leading-relaxed text-sand/80 md:text-2xl">
							Build boldly. Learn together. Ship something that makes you proud. GeauxHack is a
							free, student-led weekend of creativity at LSU.
						</p>
						<div
							class="mt-5 flex flex-wrap gap-3 font-mono-retro text-[0.65rem] tracking-[0.16em] uppercase"
						>
							<span class="chip border-amber/45 bg-amber/10 text-amber"
								>Louisiana's largest hackathon</span
							>
							<span class="chip border-sand/20 text-sand/65">October 23–25 · LSU</span>
						</div>
						<div class="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
							<a
								use:pulse
								href={FORM_URL}
								target="_blank"
								rel="noreferrer"
								class="button-primary font-display">Apply now <span>↗</span></a
							>
							<a use:pulse href="#about" class="button-secondary font-display">Explore the event</a>
						</div>
						<div
							class="mt-6 grid max-w-xl grid-cols-1 gap-2 font-mono-retro text-[0.65rem] tracking-[0.12em] text-sand/65 uppercase sm:grid-cols-3"
						>
							<div class="rounded-lg border border-sand/15 bg-slate/55 px-3 py-3">
								<span class="block text-sand/40">Soft deadline</span>
								<strong class="mt-1 block text-amber">September 30</strong>
							</div>
							<div class="rounded-lg border border-sand/15 bg-slate/55 px-3 py-3">
								<span class="block text-sand/40">Hard deadline</span>
								<strong class="mt-1 block text-amber">October 20</strong>
							</div>
							<div class="rounded-lg border border-sand/15 bg-slate/55 px-3 py-3">
								<span class="block text-sand/40">Event</span>
								<strong class="mt-1 block text-amber">Oct 23–25</strong>
							</div>
						</div>
					</div>
				</div>

				<div class="hero-side">
					<img
						class="hero-flyer"
						src="/geauxhack-hero.png"
						alt="GeauxHack 2026 space-themed event artwork"
					/>

					<div class="hero-countdown">
						<div use:reveal={{ delay: 240 }}>
							<p
								class="mb-4 text-center font-mono-retro text-[0.65rem] tracking-[0.3em] text-sand/50 uppercase"
							>
								T-minus
							</p>
							<div class="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
								{#each countdownParts as part (part.label)}
									<div class="countdown-cell">
										<span class="font-mono-retro text-3xl font-bold text-amber sm:text-5xl"
											>{part.value.toString().padStart(2, '0')}</span
										>
										<span
											class="font-mono-retro text-[0.6rem] tracking-[0.18em] text-sand/55 uppercase sm:text-[0.7rem]"
											>{part.label}</span
										>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="about" class="section-shell px-6 py-24 md:px-10 md:py-32">
		<div class="mx-auto max-w-6xl">
			<div class="section-heading">
				<div use:reveal>
					<p class="eyebrow">01 / the brief</p>
					<h2 class="section-title mt-4">Make something<br /><span>worth showing.</span></h2>
				</div>
				<div use:reveal={{ delay: 100 }} class="max-w-2xl">
					<p class="text-xl leading-relaxed text-sand/90 md:text-2xl">
						GeauxHack brings curious students together for one focused weekend of building,
						experimenting, and sharing ideas.
					</p>
					<p class="mt-6 leading-relaxed text-sand/65">
						You do not need a perfect idea or years of experience. Bring a question, a sketch, or a
						completely unreasonable concept. Find a team, learn something new, and leave with a
						project you can call your own.
					</p>
					<a use:pulse href="#faq" class="inline-link mt-8">Read the FAQ <span>→</span></a>
				</div>
			</div>
		</div>
	</section>

	<section
		id="prizes"
		class="section-shell border-y border-sand/10 bg-crimson/10 px-6 py-24 md:px-10 md:py-32"
	>
		<div class="mx-auto max-w-6xl">
			<div class="section-heading center">
				<div use:reveal>
					<p class="eyebrow">02 / more than a weekend</p>
					<h2 class="section-title mt-4">Build for<br /><span>the upside.</span></h2>
				</div>
				<div use:reveal={{ delay: 100 }}>
					<p class="font-display text-4xl leading-tight font-bold text-amber md:text-6xl">
						$5,000+ <span class="text-sand/85">in prizes, credits, and opportunities.</span>
					</p>
					<p class="mt-6 max-w-2xl text-lg leading-relaxed text-sand/75">
						Hackers can compete for services and credits that keep their ideas moving after the
						event, plus top-3 placements across both the Beginner and Advanced brackets.
					</p>
					<div class="mt-8 grid gap-3 sm:grid-cols-3">
						<div class="border border-sand/15 bg-slate/55 p-4">
							<p class="font-mono-retro text-[0.65rem] tracking-[0.15em] text-amber uppercase">
								01
							</p>
							<p class="mt-3 font-display text-lg font-semibold text-sand">Beginner bracket</p>
							<p class="mt-1 text-sm text-sand/60">Top 3 placements</p>
						</div>
						<div class="border border-sand/15 bg-slate/55 p-4">
							<p class="font-mono-retro text-[0.65rem] tracking-[0.15em] text-amber uppercase">
								02
							</p>
							<p class="mt-3 font-display text-lg font-semibold text-sand">Advanced bracket</p>
							<p class="mt-1 text-sm text-sand/60">Top 3 placements</p>
						</div>
						<div class="border border-sand/15 bg-slate/55 p-4">
							<p class="font-mono-retro text-[0.65rem] tracking-[0.15em] text-amber uppercase">
								03
							</p>
							<p class="mt-3 font-display text-lg font-semibold text-sand">Keep building</p>
							<p class="mt-1 text-sm text-sand/60">Services + credits</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="sponsors" class="section-shell px-6 py-24 md:px-10 md:py-32">
		<div class="mx-auto max-w-6xl">
			<div class="section-heading">
				<div use:reveal>
					<p class="eyebrow">03 / the people behind it</p>
					<h2 class="section-title mt-4">Backed by<br /><span>builders.</span></h2>
				</div>
				<p use:reveal={{ delay: 100 }} class="max-w-xl text-lg leading-relaxed text-sand/70">
					Our confirmed sponsors are helping make the GeauxHack experience possible with prizes,
					credits, and opportunities for hackers.
				</p>
			</div>
			<div class="mt-12 grid grid-cols-2 gap-4 md:mt-14 lg:grid-cols-4">
				{#each sponsors as sponsor, i (sponsor.name)}
					<div use:reveal={{ delay: i * 70 }} use:pulse class="sponsor-tile">
						<span class="tile-name">{sponsor.name}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section
		id="community"
		class="section-shell border-y border-sand/10 bg-slate/70 px-6 py-24 md:px-10 md:py-32"
	>
		<div class="mx-auto max-w-6xl">
			<div class="section-heading">
				<div use:reveal>
					<p class="eyebrow">04 / campus community</p>
					<h2 class="section-title mt-4">Built with<br /><span>our clubs.</span></h2>
				</div>
				<p use:reveal={{ delay: 100 }} class="max-w-xl text-lg leading-relaxed text-sand/70">
					GeauxHack is also powered by the student organizations and campus communities bringing
					hackers together at LSU.
				</p>
			</div>
			<div class="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
				{#each clubs as club, i (club.name)}
					<a
						use:reveal={{ delay: i * 70 }}
						use:pulse
						class="sponsor-tile"
						href={club.url}
						target="_blank"
						rel="noreferrer"
					>
						<div class="tile-swap">
							<div class="tile-face tile-front">
								<strong class="font-display text-lg text-sand/85">{sponsor.name}</strong>
							</div>
							<div class="tile-face tile-back" aria-hidden="true">
								<img class="sponsor-logo" src={sponsor.logo} alt={`${sponsor.name} logo`} />
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section
		id="location"
		class="section-shell border-y border-sand/10 bg-crimson/10 px-6 py-24 md:px-10 md:py-32"
	>
		<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
			<div use:reveal>
				<p class="eyebrow">05 / find us</p>
				<h2 class="section-title mt-4">Meet us<br /><span>at PFT.</span></h2>
				<p class="mt-6 max-w-md leading-relaxed text-sand/70">
					The event will take place at Patrick F. Taylor Hall (PFT) on LSU's campus in Baton Rouge,
					Louisiana. Room details and check-in instructions will be shared with registered hackers.
				</p>
				<a
					use:pulse
					class="inline-link mt-8"
					href="https://www.google.com/maps/search/?api=1&query=Patrick+F.+Taylor+Hall+Baton+Rouge+LA"
					target="_blank"
					rel="noreferrer">Open in Google Maps <span>↗</span></a
				>
			</div>
			<div use:reveal={{ delay: 120 }} use:pulse class="map-frame">
				<iframe
					title="Map showing Patrick F. Taylor Hall at LSU"
					src={MAP_URL}
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					allowfullscreen
				></iframe>
			</div>
		</div>
	</section>

	<section id="faq" class="section-shell px-6 py-24 md:px-10 md:py-32">
		<div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.65fr_1.35fr]">
			<div use:reveal>
				<p class="eyebrow">06 / no silly questions</p>
				<h2 class="section-title mt-4">Good to<br /><span>know.</span></h2>
			</div>
			<div class="space-y-3">
				{#each faqs as faq, i (faq.question)}
					<div
						use:reveal={{ delay: i * 55 }}
						use:pulse
						class:faq-open={openFaq === i}
						class="faq-item"
					>
						<button
							use:pulse
							type="button"
							class="faq-trigger"
							aria-expanded={openFaq === i}
							onclick={() => toggleFaq(i)}
						>
							<span class="faq-swap">
								<span class="faq-face faq-front">{faq.question}</span>
								<span class="faq-face faq-back" aria-hidden="true">{faq.teaser}</span>
							</span>
							<b aria-hidden="true">+</b>
						</button>
						<div class="faq-answer" class:faq-answer-open={openFaq === i}>
							<p>{faq.answer}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<footer class="bg-slate px-6 py-10 md:px-10">
		<div
			class="mx-auto flex max-w-6xl flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"
		>
			<p class="font-display text-lg font-bold text-amber">
				GeauxHack <span class="text-crimson">'26</span>
			</p>
			<p class="font-mono-retro text-[0.6rem] tracking-[0.22em] text-sand/45 uppercase">
				Built at LSU · See you there
			</p>
		</div>
	</footer>
</main>
