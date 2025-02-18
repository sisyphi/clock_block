<script lang="ts">
	import SlotBuilder from '$lib/components/Slot_Builder.svelte';
	import BlockBuilder from '$lib/components/Block_Builder.svelte';

	import { Button } from 'bits-ui';
	import Clock12H from '$lib/components/Clock12H.svelte';

	interface Slot {
		name: string;
		color: string;
	}

	interface Timeblock {
		active_on_timetable: boolean;
		block: string;
		slot: Slot;
		active_slot: Slot;
	}

	let increment: string = '+0100';
	let start_block: string = '0900';
	let end_block: string = '1700';

	let blocks: Array<string> = createBlocks();

	let default_slot: Slot = {
		name: 'Default',
		color: '#B1B1B1'
	};

	let slots: Array<Slot> = [
		default_slot,
		{ name: 'Click to select', color: '#ffd000' },
		{ name: 'Double click to rename', color: '#009dff' },
		{ name: 'Recolor & Delete', color: '#ff0000' }
	];

	let timeblocks: Array<Timeblock> = createTimeblock(blocks, start_block, end_block);

	let am_timeblocks: Array<Timeblock> = structuredClone(timeblocks).slice(0, timeblocks.length / 2);
	let pm_timeblocks: Array<Timeblock> = structuredClone(timeblocks).slice(timeblocks.length / 2);

	let active_slot: Slot = default_slot;

	let clock_size: number = 300;
	let size: number;
	$: size = clock_size * 0.4;

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
				slot: default_slot,
				active_slot: default_slot
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
				slot: prev_timeblocks[idx].slot,
				active_slot: prev_timeblocks[idx].active_slot
			};

			let updated_slot = slots.filter(function (slot: Slot) {
				return slot.name == timeblock.slot.name;
			})[0];

			if (updated_slot == null) updated_slot = default_slot;
			else {
				timeblock.slot = updated_slot;
				// active_slot = updated_slot;
			}

			next_timeblocks.push(timeblock);
		}

		return next_timeblocks;
	}

	$: {
		timeblocks = updateTimeblocks(start_block, end_block, slots, timeblocks, increment);

		timeblocks = shiftTimeblocks(timeblocks, start_block);

		am_timeblocks = shiftTimeblocks(structuredClone(timeblocks), '0000').slice(0, timeblocks.length / 2);
		pm_timeblocks = shiftTimeblocks(structuredClone(timeblocks), '0000').slice(timeblocks.length / 2);
	}

	function insertSlot(timeblock: Timeblock, active_slot: Slot) {
		timeblock.slot = active_slot;
		timeblocks = [...timeblocks];
	}

	function handleBGColor(timeblock: Timeblock, active_slot: Slot) {
		timeblock.active_slot = active_slot;
		timeblocks = [...timeblocks];
	}
</script>

<div class="w-full h-full px-6 md:px-8">
	<div class="flex flex-col justify-between gap-2 py-4 mx-auto xs:max-w-2xl xs:flex-row">
		<BlockBuilder bind:blocks bind:increment bind:start_block bind:end_block></BlockBuilder>
	</div>

	<div class="flex flex-col justify-around max-w-sm gap-4 mx-auto sm:flex-row sm:max-w-2xl">
		<div class="px-2 py-4 pr-4 overflow-scroll border-2 rounded-sm sm:w-1/2 md:w-1/2 sm:flex sm:flex-col border-offblack overscroll-contain max-h-64 sm:max-h-96">
			{#each timeblocks as timeblock}
				{#if timeblock.active_on_timetable}
					<div class="flex flex-row gap-2 mb-2">
						<p class="text-xs text-right text-offblack/90 min-w-8">{timeblock.block}</p>
						<Button.Root
							on:click={() => insertSlot(timeblock, active_slot)}
							on:mouseenter={() => handleBGColor(timeblock, active_slot)}
							on:mouseleave={() => handleBGColor(timeblock, timeblock.slot)}
							class="{active_slot.name == timeblock.slot.name ? 'cursor-default' : 'cursor-pointer'} flex flex-row justify-between w-full"
						>
							<div style:background-color={timeblock.active_slot.color} class="w-full p-1 border-2 rounded-sm border-offblack">
								<p class="{timeblock.active_slot.name == 'Default' ? 'opacity-0 select-none' : ''} text-center">
									{timeblock.active_slot.name}
								</p>
							</div>
						</Button.Root>
					</div>
				{/if}
			{/each}
		</div>

		<div class="px-2 py-4 pr-4 overflow-scroll border-2 rounded-sm sm:w-1/2 border-offblack overscroll-contain max-h-64 sm:max-h-96">
			<SlotBuilder bind:default_slot bind:slots bind:active_slot></SlotBuilder>
		</div>
	</div>
</div>
<div bind:clientWidth={clock_size} class="grid justify-center w-full grid-cols-10 mx-auto sm:max-w-2xl grid-rows-10 sm:flex-row">
	<div class="col-start-1 col-end-8 row-start-5 mx-auto row-end-11">
		<Clock12H bind:timeblocks={am_timeblocks} {increment} {size}></Clock12H>
	</div>
	<div class="col-start-4 col-end-11 row-start-1 row-end-7 mx-auto">
		<Clock12H bind:timeblocks={pm_timeblocks} {increment} {size}></Clock12H>
	</div>
</div>
