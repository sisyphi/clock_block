<script>
	import { browser } from '$app/environment';
	import { closeOnEscape, closeOnClickOutside, trapFocus } from '$lib/components/UX_Utilities.js';

	import Close from '$lib/icons/Close.svelte';

	/**
	 * @type {boolean}
	 */
	export let isMenuOpen;

	function closeMenu() {
		isMenuOpen = false;
	}

	// Prevent body scroll when Menu is open
	$: if (browser && isMenuOpen) document.body.classList.toggle('overflow-hidden', isMenuOpen);
</script>

<!-- Close Menu on Keydown Escape -->
<svelte:window use:closeOnEscape on:escape={closeMenu} />

<div class="absolute inset-0 z-50 w-full h-screen backdrop-blur-sm bg-neutral-800/80"></div>

<!-- 
	use:trapFocus - Trap Focus within Menu
	use:closeOnClickOutside & on:outclick - Close Menu on Outside Click
-->

<div
	use:trapFocus
	use:closeOnClickOutside
	on:outclick={closeMenu}
	class="absolute inset-0 z-50 h-screen px-6 py-2 overflow-scroll shadow-lg w-72 bg-neutral-800 md:px-8 md:py-4"
>
	<div class="flex justify-between w-auto">
		<a href="/timeblock-builder" class="self-center">
			<span class="sr-only">Clock Block</span>
			<img src="" alt="Clock Block" />
		</a>

		<button on:click={closeMenu} aria-expanded={isMenuOpen} class="p-2 hover:bg-neutral-700 hover:rounded-lg">
			<span class="sr-only">Close main Menu</span>
			<Close class="size-6"></Close>
		</button>
	</div>

	<div class="flex flex-col w-full py-4 text-left">
		<a on:click={closeMenu} href="/timeblock-builder/about" class="inline-flex items-center px-4 py-2 hover:underline"><span>Learn</span></a>
		<a
			on:click={closeMenu}
			href="/timeblock-builder"
			class="inline-flex justify-center px-4 py-2 my-2 rounded-lg bg-neutral-200 hover:bg-neutral-100 text-neutral-800 hover:underline"
		>
			<span>Build</span>
		</a>
	</div>
</div>
