<script>
    import "../app.css";

    import Navbar_1 from "$lib/components/Navbar_1.svelte";
    import MobileNavbar_1 from "$lib/components/Mobile_Navbar_1.svelte";

    let isMenuOpen = false;
</script>

<Navbar_1 bind:isMenuOpen>
	<MobileNavbar_1 slot="mobile-menu" bind:isMenuOpen />
</Navbar_1>