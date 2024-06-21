<script lang="ts">
	import SlotBuilder from '$lib/components/Slot_Builder.svelte';
	import BlockBuilder from '$lib/components/Block_Builder.svelte';

	let blocks: Array<string>;
	let start_block: string;
	let end_block: string;

	interface Slot {
		name: string;
		color: string;
	}

	let slots: Array<Slot>;
</script>

<section>
	<BlockBuilder bind:chosen_blocks={blocks} bind:chosen_start_block={start_block} bind:chosen_end_block={end_block}></BlockBuilder>
	<SlotBuilder></SlotBuilder>
	<!-- <TimeblockBuilder></TimeblockBuilder> -->
</section>
