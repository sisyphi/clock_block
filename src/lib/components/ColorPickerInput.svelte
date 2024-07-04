<script lang="ts">
	import Palette from '$lib/icons/Palette.svelte';

	/** DOM element of the label wrapper */
	export let labelElement: HTMLLabelElement;

	/** hex color */
	export let hex: string | undefined;

	/** input label */
	export let label: string;

	/** input name, useful in a native form */
	export let name: string | undefined = undefined;

	/** svelte-ignore unused-export-let */
	export let isOpen: boolean;
	isOpen;

	function noop() {
		/* prevent browser color picker from opening unless javascript is broken */
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events -->
<label
	bind:this={labelElement}
	on:click|preventDefault={noop}
	on:mousedown|preventDefault={noop}
	class="grid p-2 rounded-sm cursor-pointer hover:bg-offblack text-offblack hover:text-offwhite"
>
	<span class="sr-only">{label}</span>
	<input
		type="color"
		{name}
		value={hex}
		on:click|preventDefault={noop}
		on:mousedown|preventDefault={noop}
		aria-haspopup="dialog"
		class="col-start-1 col-end-1 row-start-1 row-end-1 opacity-0 size-0"
	/>
	<Palette class="col-start-1 col-end-1 row-start-1 row-end-1 select-none size-5"></Palette>
</label>
