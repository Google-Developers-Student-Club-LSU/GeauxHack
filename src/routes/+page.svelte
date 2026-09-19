<script lang="ts">
	import { onMount } from 'svelte';
	import PartnerMark from '$lib/components/PartnerMark.svelte';
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
			teaser: 'Every level',
			answer:
				'Our hackathon is open to high school, undergraduate, and graduate students from any school in the United States. Students of all coding backgrounds and experience levels are encouraged to participate. We will have beginner, intermediate, and advanced brackets so you can compete alongside hackers at a similar experience level. Anyone interested in helping as a volunteer or mentor is also welcome.'
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
	interface Partner {
		name: string;
		logo: string;
		url?: string;
	}

	const sponsors: Partner[] = [
		{ name: 'Deepspace', logo: '/sponsors/deepspace.png' },
		{ name: 'Lumix', logo: '/sponsors/lumix.png' },
		{ name: 'Nexus', logo: '/sponsors/nexus.png' },
		{ name: 'Google', logo: '/sponsors/google.svg' }
	];

	const clubs: Partner[] = [
		{ name: 'GDG on Campus', logo: '/sponsors/gdg.png', url: 'https://gdsclsu.org' },
		{ name: 'SASE LSU', logo: '/sponsors/sase.png', url: 'https://saselsu.org' },
		{ name: 'LSU', logo: '/sponsors/lsu.png', url: 'https://www.lsu.edu' }
	];

	const brackets = [
		{ name: 'Beginner bracket', detail: 'Top 3 placements' },
		{ name: 'Intermediate bracket', detail: 'Top 3 placements' },
		{ name: 'Advanced bracket', detail: 'Top 3 placements' },
		{ name: 'Keep building', detail: 'Services + credits' }
	];

	const footerLinks = [
		{ label: 'About', href: '#about' },
		{ label: 'Prizes', href: '#prizes' },
		{ label: 'Partners', href: '#partners' },
		{ label: 'Location', href: '#location' },
		{ label: 'FAQ', href: '#faq' }
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
	<section id="home" class="hero-section section-shell relative isolate">
		<div class="hero-glow hero-glow-crimson" aria-hidden="true"></div>
		<div class="hero-glow hero-glow-amber" aria-hidden="true"></div>

		<div class="hero-stage relative isolate flex w-full flex-1 flex-col justify-center">
			<div
				class="hero-layout shell flex w-full flex-col items-center gap-10 xl:flex-row xl:items-center xl:justify-between xl:gap-16"
			>
				<div class="hero-content w-full max-w-2xl xl:max-w-3xl">
					<div use:reveal class="max-w-2xl text-center xl:max-w-none xl:text-left">
						<p
							class="mb-5 font-mono-retro text-xs tracking-[0.35em] text-sand/70 uppercase md:text-sm"
						>
							LSU · October 23, 2026
						</p>
						<h1 class="hero-title font-display leading-[0.9] font-bold text-sand">
							Geaux<span class="text-amber">Hack</span>
							<span class="block text-crimson">'26</span>
						</h1>
						<p class="mt-5 max-w-2xl text-xl leading-relaxed text-sand/80 md:text-2xl">
							Build boldly. Learn together. Ship something that makes you proud. GeauxHack is a
							free, student-led weekend of creativity at LSU.
						</p>
						<div
							class="mt-5 flex flex-wrap justify-center gap-3 font-mono-retro text-[0.65rem] tracking-[0.16em] uppercase xl:justify-start"
						>
							<span class="chip border-amber/45 bg-amber/10 text-amber"
								>Louisiana's largest hackathon</span
							>
							<span class="chip border-sand/20 text-sand/65">October 23–25 · LSU</span>
						</div>
						<div class="mt-6 flex flex-wrap items-center justify-center gap-4 xl:justify-start">
							<a
								use:pulse
								href={FORM_URL}
								target="_blank"
								rel="noreferrer"
								class="button-primary font-display">Apply now <span>↗</span></a
							>
							<a use:pulse href="#about" class="button-secondary font-display">Explore the event</a>
						</div>
						<dl
							class="deadline-list mx-auto mt-6 grid max-w-xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-sand/15 bg-sand/10 font-mono-retro text-[0.65rem] tracking-[0.12em] uppercase sm:grid-cols-3 xl:mx-0"
						>
							<div class="bg-slate/80 px-3.5 py-3">
								<dt class="text-sand/45">Soft deadline</dt>
								<dd class="mt-1 font-bold text-amber">September 30</dd>
							</div>
							<div class="bg-slate/80 px-3.5 py-3">
								<dt class="text-sand/45">Hard deadline</dt>
								<dd class="mt-1 font-bold text-amber">October 20</dd>
							</div>
							<div class="bg-slate/80 px-3.5 py-3">
								<dt class="text-sand/45">Event</dt>
								<dd class="mt-1 font-bold text-amber">Oct 23–25</dd>
							</div>
						</dl>
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

	<section id="about" class="section-shell">
		<div class="shell">
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

	<section id="prizes" class="section-shell border-y border-sand/10 bg-crimson/10">
		<div class="shell">
			<div class="section-heading">
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
						event, plus top-3 placements in the Beginner, Intermediate, and Advanced brackets.
					</p>
					<div class="mt-8 grid gap-3 xs:grid-cols-2 lg:grid-cols-4">
						{#each brackets as bracket, i (bracket.name)}
							<div class="border border-sand/15 bg-slate/55 p-4">
								<p class="font-mono-retro text-[0.65rem] tracking-[0.15em] text-amber uppercase">
									{(i + 1).toString().padStart(2, '0')}
								</p>
								<p class="mt-3 font-display text-lg font-semibold text-sand">{bracket.name}</p>
								<p class="mt-1 text-sm text-sand/60">{bracket.detail}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="partners" class="section-shell border-y border-sand/10 bg-slate/70">
		<div class="shell">
			<div class="section-heading">
				<div use:reveal>
					<p class="eyebrow">03 / the people behind it</p>
					<h2 class="section-title mt-4">Backed by<br /><span>builders.</span></h2>
				</div>
				<p use:reveal={{ delay: 100 }} class="max-w-xl text-lg leading-relaxed text-sand/70">
					Sponsors are funding prizes, credits, and opportunities for hackers, while our campus
					clubs bring the LSU community together.
				</p>
			</div>

			<div id="sponsors" class="section-body">
				<p use:reveal class="group-label">Sponsors</p>
				<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{#each sponsors as sponsor, i (sponsor.name)}
						<div use:reveal={{ delay: i * 70 }} use:pulse class="logo-tile">
							<PartnerMark src={sponsor.logo} alt={`${sponsor.name} logo`} />
						</div>
					{/each}
				</div>
			</div>

			<div id="community" class="section-body">
				<p use:reveal class="group-label">Campus clubs</p>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each clubs as club, i (club.name)}
						<a
							use:reveal={{ delay: i * 70 }}
							use:pulse
							class="logo-tile logo-tile-row"
							href={club.url}
							target="_blank"
							rel="noreferrer"
							aria-label={`${club.name} website`}
						>
							<PartnerMark src={club.logo} alt={`${club.name} logo`} />
							<span class="tile-link-glyph" aria-hidden="true">↗</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section id="location" class="section-shell border-y border-sand/10 bg-crimson/10">
		<div class="shell section-heading">
			<div use:reveal>
				<p class="eyebrow">04 / find us</p>
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

	<section id="faq" class="section-shell">
		<div class="shell section-heading">
			<div use:reveal>
				<p class="eyebrow">05 / no silly questions</p>
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

	<footer class="site-footer border-t border-sand/10 bg-slate">
		<div class="shell flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
			<div>
				<p class="font-display text-xl font-bold text-amber">
					GeauxHack <span class="text-crimson">'26</span>
				</p>
				<p class="mt-2 max-w-md leading-relaxed text-sand/60">
					A free, student-led hackathon at Louisiana State University · October 23–25, 2026.
				</p>
			</div>
			<nav class="flex flex-wrap gap-x-6 gap-y-2">
				{#each footerLinks as link (link.href)}
					<a
						href={link.href}
						class="nav-link font-mono-retro text-[0.68rem] tracking-[0.18em] text-sand/70 uppercase transition hover:text-amber"
						>{link.label}</a
					>
				{/each}
			</nav>
			<a
				use:pulse
				href={FORM_URL}
				target="_blank"
				rel="noreferrer"
				class="button-primary self-start font-display">Apply now <span>↗</span></a
			>
		</div>
		<div class="shell mt-10 border-t border-sand/10 pt-5">
			<p class="font-mono-retro text-[0.6rem] tracking-[0.22em] text-sand/45 uppercase">
				Built at LSU · Free to attend · All experience levels
			</p>
		</div>
	</footer>
</main>
