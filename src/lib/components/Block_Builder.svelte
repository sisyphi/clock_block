<script lang="ts">
	import RadioChecked from '$lib/icons/Radio_Checked.svelte';
	import RadioUnchecked from '$lib/icons/Radio_Unchecked.svelte';
	import CaretUpDown from '$lib/icons/Caret_Up_Down.svelte';
	import Check from '$lib/icons/Check.svelte';
	import { RadioGroup, Select, Label } from 'bits-ui';

	let increment = '+0100';
	let increments = [
		{
			id: 'plus-fifteen-min',
			value: '+0015',
			label: '+00:15'
		},
		{
			id: 'plus-thirty-min',
			value: '+0030',
			label: '+00:30'
		},
		{
			id: 'plus-one-hr',
			value: '+0100',
			label: '+01:00'
		}
	];

	interface BlockSelectionItem {
		value: string;
		label: string;
	}

	let start_times: Array<BlockSelectionItem>;
	let end_times: Array<BlockSelectionItem>;

	function formatBlocks(blocks: Array<string>, start_time: string, end_time: string) {
		// if starting and ending hour are not in the proper format, default to returning all blocks
		if (start_time.length != 4 || end_time.length != 4) return blocks;

		let start_hour = start_time.slice(0, 2);
		let end_hour = end_time.slice(0, 2);

		if (Number(start_hour) < 0 || Number(start_hour) >= 24) return blocks;
		if (Number(end_hour) < 0 || Number(end_hour) >= 24) return blocks;

		// format the blocks to the chosen start and end times
		while (start_hour != blocks[0].slice(0, 2)) {
			blocks.push(blocks.shift()!);
		}

		return blocks;
	}

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

	function createBlockLabel(block: string, military_time: boolean, leading_zero: boolean) {
		let block_label: string;

		let hour = block.slice(0, 2);
		let minute = block.slice(2);

		if (!military_time) {
			minute = minute + (hour < '12' ? 'am' : 'pm');
			hour = Number(hour) % 12 == 0 ? '12' : (Number(hour) % 12).toString();
		}

		if (leading_zero) hour = ('0' + hour).slice(-2);
		else hour = Number(hour).toString();

		block_label = hour + ':' + minute;

		return block_label;
	}

	function createBlockSelectItems(increment: string, military_time: boolean, leading_zero: boolean) {
		let blocks = createBlocks(increment);
		let blockSelectItems = [];

		for (let idx = 0; idx < blocks.length; idx++) {
			blockSelectItems.push({
				value: blocks[idx],
				label: createBlockLabel(blocks[idx], military_time, leading_zero)
			});
		}

		return blockSelectItems;
	}

	$: {
		let blockSelectItems = createBlockSelectItems(increment, false, false);
		start_times = blockSelectItems;
		end_times = blockSelectItems;
	}

	export let chosen_blocks: Array<string>;

	let chosen_start_block_item: BlockSelectionItem;
	let chosen_end_block_item: BlockSelectionItem;

	export let chosen_start_block: string;
	export let chosen_end_block: string;

	function isEmpty(obj: Object) {
		for (const prop in obj) {
			if (Object.hasOwn(obj, prop)) {
				return false;
			}
		}
		return true;
	}

	$: if (!isEmpty(chosen_start_block) && !isEmpty(chosen_end_block)) {
		chosen_blocks = createBlocks(increment);
		chosen_start_block = chosen_start_block_item.value;
		chosen_end_block = chosen_end_block_item.value;
	}
</script>

<div>
	<div class="p-4">
		<h2>Block Increments</h2>
		<RadioGroup.Root bind:value={increment}>
			{#each increments as increment}
				<RadioGroup.Item id={increment.id} value={increment.value} class="flex flex-row items-center [&[data-state=checked]>svg]:hidden">
					<!-- <RadioUnchecked class="text-[{'#0022ffa6'}]" /> -->
					<RadioUnchecked />
					<RadioGroup.ItemIndicator><RadioChecked /></RadioGroup.ItemIndicator>
					<Label.Root for={increment.id}>{increment.label}</Label.Root>
				</RadioGroup.Item>
			{/each}
		</RadioGroup.Root>
	</div>
	<div class="p-4">
		<h2>Start Time</h2>
		<Select.Root bind:selected={chosen_start_block_item}>
			<Select.Trigger aria-label="Select a start time" class="flex flex-row items-center justify-between gap-2 min-w-32">
				<Select.Value placeholder="Select a start time" />
				<CaretUpDown class="size-6" />
			</Select.Trigger>

			<Select.Content class="p-2 my-2 overflow-scroll bg-white border outline-none max-h-64">
				{#each start_times as start_time}
					<Select.Item value={start_time.value} label={start_time.label} class="flex flex-row items-center justify-between p-2">
						<Label.Root for={start_time.value}>{start_time.label}</Label.Root>
						<Select.ItemIndicator>
							<Check class="size-6" />
						</Select.ItemIndicator>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
	<div class="p-4">
		<h2>End Time</h2>
		<Select.Root bind:selected={chosen_end_block_item}>
			<Select.Trigger aria-label="Select a start time" class="flex flex-row items-center justify-between gap-2 min-w-32">
				<Select.Value placeholder="Select a start time" />
				<CaretUpDown class="size-6" />
			</Select.Trigger>

			<Select.Content class="p-2 my-2 overflow-scroll bg-white border outline-none max-h-64">
				{#each end_times as end_time}
					<Select.Item value={end_time.value} label={end_time.label} class="flex flex-row items-center justify-between p-2">
						<Label.Root for={end_time.value}>{end_time.label}</Label.Root>
						<Select.ItemIndicator>
							<Check class="size-6" />
						</Select.ItemIndicator>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
</div>
