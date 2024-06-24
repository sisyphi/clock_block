<script lang="ts">
	import SlotBuilder from '$lib/components/Slot_Builder.svelte';
	import BlockBuilder from '$lib/components/Block_Builder.svelte';
	import { Button } from 'bits-ui';

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

	function isWithinStartEnd(block: string, start_block: string, end_block: string) {
		let hour = Number(block.slice(0, 2));
		let start_hour = Number(start_block.slice(0, 2));
		let end_hour = Number(end_block.slice(0, 2));

		return hour >= start_hour && hour <= end_hour;
	}

	let increment: string = '+0100';
	let start_block: string = '0900';
	let end_block: string = '1700';

	let blocks: Array<string> = createBlocks(increment);

	interface Slot {
		name: string;
		color: string;
	}

	let default_slot: Slot = {
		name: 'Default',
		color: '#ABABAB'
	};

	let slots: Array<Slot> = [default_slot];

	interface Timeblock {
		active_on_timetable: boolean;
		block: string;
		slot: Slot;
	}

	let timeblocks: Array<Timeblock> = createTimeblocks(blocks, start_block, end_block);
	$: timeblocks = createTimeblocks(blocks, start_block, end_block);

	function createTimeblocks(blocks: Array<string>, start_block: string, end_block: string) {
		let timeblocks: Array<Timeblock> = [];
		for (let idx = 0; idx < blocks.length; idx++) {
			timeblocks.push({
				active_on_timetable: isWithinStartEnd(blocks[idx], start_block, end_block),
				block: blocks[idx],
				slot: default_slot
			});
		}

		return timeblocks;
	}

	$: timeblocks = updateTimeblocks(slots);

	function updateTimeblocks(slots: Array<Slot>) {
		let updated_timeblocks: Array<Timeblock> = [];
		for (let idx = 0; idx < blocks.length; idx++) {
			let updated_slot = slots.filter(function (slot: Slot) {
				return slot.name == timeblocks[idx].slot.name;
			})[0];

			if (updated_slot == null) updated_slot = default_slot;

			updated_timeblocks.push({
				active_on_timetable: isWithinStartEnd(blocks[idx], start_block, end_block),
				block: blocks[idx],
				slot: updated_slot
			});
		}

		return updated_timeblocks;
	}

	let active_slot: Slot;
</script>

<section>
	<BlockBuilder bind:chosen_blocks={blocks} bind:chosen_increment={increment} bind:chosen_start_block={start_block} bind:chosen_end_block={end_block}></BlockBuilder>
	<SlotBuilder bind:default_slot bind:slots bind:active_slot></SlotBuilder>

	<div class="p-4">
		{#each timeblocks as timeblock}
			{#if timeblock.active_on_timetable}
				<div style:background-color={timeblock.slot != undefined ? timeblock.slot.color : '#2B2B2B'}>
					<Button.Root on:click={() => (timeblock.slot = active_slot)} class="flex flex-row gap-2 py-2 hover:bg-neutral-300">
						<p>{timeblock.block}</p>
						{#if timeblock.slot != undefined}
							<p>{timeblock.slot.name}</p>
						{/if}
					</Button.Root>
				</div>
			{/if}
		{/each}
	</div>
</section>
