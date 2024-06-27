<script lang="ts">
	import SlotBuilder from '$lib/components/Slot_Builder.svelte';
	import BlockBuilder from '$lib/components/Block_Builder.svelte';
	import { Button } from 'bits-ui';

	function createBlocks(increment: string) {
		let blocks: Array<string> = [];
		const MINUTE_VALUES: Array<string> = ['00', '15', '30', '45'];

		// creates the list of all blocks with the increment provided
		for (let hour = 0; hour < 24; hour++) {
			let hour_value = ('0' + hour).slice(-2);

			let minute_increment = MINUTE_VALUES.length;
			if (increment == '+0100') minute_increment = 4;
			else if (increment == '+0030') minute_increment = 2;
			else if (increment == '+0015') minute_increment = 1;

			for (let minute_idx = 0; minute_idx < MINUTE_VALUES.length; minute_idx += minute_increment) {
				let minute_value = MINUTE_VALUES[minute_idx];

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

	let slots: Array<Slot> = [
		default_slot
		// { name: 'Lunch', color: '#ffd000' },
		// { name: 'Dinner', color: '#ffd000' },
		// { name: 'Break', color: '#009dff' },
		// { name: 'Study', color: '#ff0000' }
	];

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
	<BlockBuilder bind:submitted_blocks={blocks} bind:submitted_increment={increment} bind:submitted_start_block={start_block} bind:submitted_end_block={end_block}
	></BlockBuilder>
	<div class="px-6 md:px-8">
		<div class="justify-around max-w-md mx-auto md:flex md:flex-row md:max-w-4xl md:gap-8">
			<div class="md:w-1/2">
				<SlotBuilder bind:default_slot bind:slots bind:active_slot></SlotBuilder>
			</div>
			<div class="md:w-1/2 md:flex md:flex-col">
				{#each timeblocks as timeblock}
					{#if timeblock.active_on_timetable}
						<div class="flex flex-row gap-2 mb-2">
							<p class="text-xs text-right text-neutral-600 min-w-20">{timeblock.block}</p>
							<Button.Root on:click={() => (timeblock.slot = active_slot)} class="flex flex-row justify-between w-full">
								<div style:background-color={timeblock.slot.color} class="w-full p-1 border-2 rounded-sm bg-neutral-300 border-neutral-800">
									<p class="{timeblock.slot.name == 'Default' ? 'opacity-0 cursor-default select-none' : ''} text-center">{timeblock.slot.name}</p>
								</div>
							</Button.Root>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</section>
