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
	$: if (browser) document.body.classList.toggle('overflow-hidden', isMenuOpen);
</script>

<!-- Close Menu on Keydown Escape -->
<svelte:window use:closeOnEscape on:escape={closeMenu} />

<div class="absolute inset-0 z-50 w-full h-screen backdrop-blur-sm bg-offblack/80"></div>

<!-- 
	use:trapFocus - Trap Focus within Menu
	use:closeOnClickOutside & on:outclick - Close Menu on Outside Click
-->

<div
	use:trapFocus
	use:closeOnClickOutside
	on:outclick={closeMenu}
	class="absolute inset-0 z-50 h-screen px-6 py-1 overflow-scroll border-r-2 shadow-lg bg-offwhite w-72 md:px-8 md:py-4 border-offblack"
>
	<div class="flex justify-between w-auto">
		<a href="/timeblock-builder" class="self-center">
			<span class="sr-only">Clock Block</span>
			<img src="" alt="Clock Block" />
		</a>

		<button on:click={closeMenu} aria-expanded={isMenuOpen} class="p-2 rounded-sm hover:text-offwhite hover:bg-offblack">
			<span class="sr-only">Close main Menu</span>
			<Close class="size-5"></Close>
		</button>
	</div>

	<div class="flex flex-col w-full py-4 text-left">
		<a on:click={closeMenu} href="/timeblock-builder/about" class="inline-flex items-center px-4 py-2 hover:underline"><span>About Me</span></a>
		<a on:click={closeMenu} href="/timeblock-builder/learn" class="inline-flex items-center px-4 py-2 hover:underline"><span>Learn</span></a>
		<a
			on:click={closeMenu}
			href="/timeblock-builder"
			class="inline-flex justify-center px-4 py-1 mx-4 my-2 border-2 rounded-lg bg-offwhite hover:bg-offblack border-offblack hover:text-offwhite"
		>
			<span>Build</span>
		</a>
	</div>
</div>
