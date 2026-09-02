import type { Action } from 'svelte/action';

export const pulse: Action<HTMLElement> = (node) => {
	if (typeof window === 'undefined') return;
	if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

	const updateOrigin = (event: PointerEvent) => {
		const bounds = node.getBoundingClientRect();
		node.style.setProperty('--pulse-x', `${event.clientX - bounds.left}px`);
		node.style.setProperty('--pulse-y', `${event.clientY - bounds.top}px`);
	};

	node.addEventListener('pointermove', updateOrigin, { passive: true });

	return {
		destroy() {
			node.removeEventListener('pointermove', updateOrigin);
		}
	};
};
