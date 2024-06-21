<script lang="ts">
	import SlotBuilder from '$lib/components/Slot_Builder.svelte';
	import BlockBuilder from '$lib/components/Block_Builder.svelte';

	function createBlocks(increment: string) {
		let blocks: Array<string> = [];
		let minute_values: Array<string> = ['00', '15', '30', '45'];

		// creates the list of all blocks with the increment provided
		for (let hour = 0; hour < 24; hour++) {
			let hour_value = ('0' + hour).slice(-2);

			let minute_increment = minute_values.length;
			if (increment == '+0100') minute_increment = 4;
			else if (increment == '+0030') minute_increment = 2;
			else if (increment == '+0015') minute_increment = 1;

			for (let minute_idx = 0; minute_idx < minute_values.length; minute_idx += minute_increment) {
				let minute_value = minute_values[minute_idx];

				blocks.push(hour_value.concat(minute_value));
			}
		}

		return blocks;
	}

	let increment: string = '+0100';
	let start_block: string = '0900';
	let end_block: string = '1700';

	let blocks: Array<string> = createBlocks(increment);

	interface Slot {
		name: string;
		color: string;
	}

	interface Timeblock {
		active_on_timetable: boolean;
		block: string;
		slot: Slot;
	}

	function isWithinStartEnd(block: string, start_block: string, end_block: string) {
		let hour = Number(block.slice(0, 2));
		let start_hour = Number(start_block.slice(0, 2));
		let end_hour = Number(end_block.slice(0, 2));

		return hour >= start_hour && hour <= end_hour;
	}

	function createTimeblocks(blocks: Array<string>, start_block: string, end_block: string) {
		let timeblocks: Array<Timeblock> = [];
		for (let idx = 0; idx < blocks.length; idx++) {
			timeblocks.push({
				active_on_timetable: isWithinStartEnd(blocks[idx], start_block, end_block),
				block: blocks[idx],
				slot: {
					name: 'Default',
					color: '#288df9'
				}
			});
		}

		return timeblocks;
	}

	let timeblocks: Array<Timeblock> = createTimeblocks(blocks, start_block, end_block);
	console.log(timeblocks);
</script>

<section>
	<BlockBuilder bind:chosen_blocks={blocks} bind:chosen_increment={increment} bind:chosen_start_block={start_block} bind:chosen_end_block={end_block}></BlockBuilder>
	<SlotBuilder></SlotBuilder>

	<div class="p-4">
		{#each timeblocks as timeblock}
			{#if timeblock.active_on_timetable}
				<div class:background-color={timeblock.slot != undefined ? timeblock.slot.color : '#2B2B2B'} class="flex flex-row gap-2">
					<p>{timeblock.block}</p>
					{#if timeblock.slot != undefined}
						<p>{timeblock.slot.name}</p>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
</section>
