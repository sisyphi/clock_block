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

	/* svelte-ignore unused-export-let /** indicator of the popup state */
	export let isOpen: boolean;

	function noop() {
		/* prevent browser color picker from opening unless javascript is broken */
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events -->
<label bind:this={labelElement} on:click|preventDefault={noop} on:mousedown|preventDefault={noop} class="flex cursor-pointer size-7">
	<div class="flex items-center">
		<input type="color" {name} value={hex} on:click|preventDefault={noop} on:mousedown|preventDefault={noop} aria-haspopup="dialog" class="opacity-0 size-0" />
		<Palette class="absolute select-none size-7"></Palette>
	</div>
</label>
