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

<header class="px-6 py-2 text-base font-bold text-center text-white bg-neutral-800 md:px-8 md:py-4">
	<nav class="flex flex-wrap justify-between max-w-6xl mx-auto md:flex-nowrap">
		<div class="flex justify-between w-full md:w-auto">
			<a href="/" class="self-center">
				<span class="sr-only">Brand Name</span>
				<img src="" alt="<BRAND NAME>" />
			</a>

			<button on:click={openMenu} aria-expanded={isMenuOpen} class="p-2 md:hidden hover:bg-neutral-700 hover:rounded-lg">
				<span class="sr-only">Open main menu</span>
				<Hamburger class="size-6"></Hamburger>
			</button>
		</div>

		<div class="hidden md:py-0 md:flex md:flex-row md:w-auto">
			<a on:click={closeMenu} href="/" class="inline-flex items-center px-4 py-2 hover:underline"><span>Home</span></a>
			<a on:click={closeMenu} href="/about" class="inline-flex items-center px-4 py-2 hover:underline"><span>About Us</span></a>
			<a on:click={closeMenu} href="/sign-in" class="inline-flex items-center px-4 py-2 hover:underline"><span>Sign In</span></a>
			<a on:click={closeMenu} href="/contact" class="inline-flex justify-center px-4 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-100 text-neutral-800 hover:underline">
				<span>Contact Us</span>
			</a>
		</div>
	</nav>
	<div class={MenuClasses}>
		<slot name="mobile-menu" />
	</div>
</header>
