<script lang="ts">
	import SlotBuilder from '$lib/components/Slot_Builder.svelte';
	import BlockBuilder from '$lib/components/Block_Builder.svelte';

	import { Button } from 'bits-ui';

	interface Slot {
		name: string;
		color: string;
	}

	interface Timeblock {
		active_on_timetable: boolean;
		block: string;
		slot: Slot;
	}

	let increment: string = '+0100';
	let start_block: string = '0900';
	let end_block: string = '1700';

	let blocks: Array<string> = createBlocks();

	let default_slot: Slot = {
		name: 'Default',
		color: '#ABABAB'
	};

	let slots: Array<Slot> = [
		default_slot,
		{ name: 'Lunch', color: '#ffd000' },
		{ name: 'Dinner', color: '#ffd000' },
		{ name: 'Break', color: '#009dff' },
		{ name: 'Study', color: '#ff0000' }
	];

	let timeblocks: Array<Timeblock> = createTimeblock(blocks, start_block, end_block);
	let active_slot: Slot = default_slot;

	function createBlocks() {
		let blocks: Array<string> = [];
		const MINUTE_VALUES: Array<string> = ['00', '15', '30', '45'];

		for (let hour = 0; hour < 24; hour++) {
			let hour_value = ('0' + hour).slice(-2);

			for (let minute_idx = 0; minute_idx < MINUTE_VALUES.length; minute_idx++) {
				let minute_value = MINUTE_VALUES[minute_idx];

				blocks.push(hour_value.concat(minute_value));
			}
		}

		return blocks;
	}

	function isInBlockRange(block: string, start_block: string, end_block: string) {
		let hour = Number(block.slice(0, 2));
		let start_hour = Number(start_block.slice(0, 2));
		let end_hour = Number(end_block.slice(0, 2));

		if (start_hour > end_hour) end_hour += 24;
		if (hour < start_hour) hour += 24;

		return hour >= start_hour && hour <= end_hour;
	}

	function isInIncrement(block: string, increment: string) {
		let minute = block.slice(2);

		if (increment == '+0015') {
			if (minute == '00' || minute == '15' || minute == '30' || minute == '45') return true;
		}

		if (increment == '+0030') {
			if (minute == '00' || minute == '30') return true;
		}

		if (increment == '+0100') {
			if (minute == '00') return true;
		}

		return false;
	}

	function shiftTimeblocks(timeblocks: Array<Timeblock>, start_block: string) {
		let start_hour = start_block.slice(0, 2);

		while (start_hour != timeblocks[0].block.slice(0, 2)) {
			let first_el = timeblocks.shift()!;
			timeblocks.push(first_el);
			timeblocks = timeblocks;
		}

		return timeblocks;
	}

	function createTimeblock(blocks: Array<string>, start_block: string, end_block: string) {
		let next_timeblocks: Array<Timeblock> = [];

		for (let idx = 0; idx < blocks.length; idx++) {
			let timeblock: Timeblock = {
				active_on_timetable: isInBlockRange(blocks[idx], start_block, end_block) && isInIncrement(blocks[idx], increment),
				block: blocks[idx],
				slot: default_slot
			};

			next_timeblocks.push(timeblock);
		}

		return next_timeblocks;
	}

	function updateTimeblocks(start_block: string, end_block: string, slots: Array<Slot>, prev_timeblocks: Array<Timeblock>, increment: string) {
		let next_timeblocks: Array<Timeblock> = [];

		for (let idx = 0; idx < prev_timeblocks.length; idx++) {
			let timeblock: Timeblock = {
				active_on_timetable: isInBlockRange(prev_timeblocks[idx].block, start_block, end_block) && isInIncrement(prev_timeblocks[idx].block, increment),
				block: prev_timeblocks[idx].block,
				slot: default_slot
			};

			if (prev_timeblocks[idx].slot.name != 'Default') timeblock.slot = prev_timeblocks[idx].slot;

			let updated_slot = slots.filter(function (slot: Slot) {
				return slot.name == timeblock.slot.name;
			})[0];

			if (updated_slot == null) updated_slot = default_slot;
			else timeblock.slot = updated_slot;

			next_timeblocks.push(timeblock);
		}

		return next_timeblocks;
	}

	$: {
		timeblocks = updateTimeblocks(start_block, end_block, slots, timeblocks, increment);

		timeblocks = shiftTimeblocks(timeblocks, start_block);
	}

	function insertSlot(timeblock: Timeblock, active_slot: Slot) {
		timeblock.slot = active_slot;
		timeblocks = [...timeblocks];
	}
</script>

<section>
	<BlockBuilder bind:blocks bind:increment bind:start_block bind:end_block></BlockBuilder>
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
							<Button.Root
								on:click={() => insertSlot(timeblock, active_slot)}
								class="{active_slot.name == timeblock.slot.name ? 'cursor-default' : 'cursor-pointer'} flex flex-row justify-between w-full"
							>
								<div style:background-color={timeblock.slot.color} class="w-full p-1 border-2 rounded-sm bg-neutral-300 border-neutral-800">
									<p class="{timeblock.slot.name == 'Default' ? 'opacity-0 select-none' : ''} text-center">
										{timeblock.slot.name}
									</p>
								</div>
							</Button.Root>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</section>
