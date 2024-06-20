<script lang="ts">
	import SlotBuilder from '$lib/components/Slot_Builder.svelte';
	import BlockBuilder from '$lib/components/Block_Builder.svelte';

	let blocks: Array<string>;

	interface Slot {
		name: string;
		color: string;
	}

	let slots: Array<Slot>;
</script>

<section>
	<BlockBuilder bind:chosen_blocks={blocks}></BlockBuilder>
	<SlotBuilder></SlotBuilder>
	<!-- <TimeblockBuilder></TimeblockBuilder> -->
</section>
