<script>
	import Hamburger from '$lib/icons/Hamburger.svelte';

	/**
	 * @type {boolean}
	 */
	export let isMenuOpen;

	function openMenu() {
		isMenuOpen = true;
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	$: MenuClasses = isMenuOpen ? 'flex' : 'hidden';
</script>

<header class="px-6 py-1 text-base font-bold text-center border-b-2 bg-offwhite text-offblack md:px-8 md:py-2 border-offblack">
	<nav class="flex flex-wrap justify-between max-w-4xl mx-auto md:flex-nowrap">
		<div class="flex justify-between w-full md:w-auto">
			<a href="/timeblock-builder" class="self-center">
				<span class="sr-only">Clock Block</span>
				<img src="" alt="Clock Block" />
			</a>

			<button on:click={openMenu} aria-expanded={isMenuOpen} class="p-2 rounded-sm md:hidden hover:bg-offblack hover:text-offwhite">
				<span class="sr-only">Open main menu</span>
				<Hamburger class="size-5"></Hamburger>
			</button>
		</div>

		<div class="hidden md:py-0 md:flex md:flex-row md:w-auto">
			<a on:click={closeMenu} href="/timeblock-builder/about" class="inline-flex items-center px-4 py-2 hover:underline"><span>About Me</span></a>
			<a on:click={closeMenu} href="/timeblock-builder/learn" class="inline-flex items-center px-4 py-2 hover:underline"><span>Learn</span></a>
			<a
				on:click={closeMenu}
				href="/timeblock-builder"
				class="content-center justify-center px-4 ml-4 border-2 rounded-sm bg-offwhite border-offblack hover:bg-offblack hover:text-offwhite text-offblack"
			>
				<span>Build</span>
			</a>
		</div>
	</nav>
	<div class={MenuClasses}>
		<slot name="mobile-menu" />
	</div>
</header>
