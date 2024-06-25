<script lang="ts">
	import RadioChecked from '$lib/icons/Radio_Checked.svelte';
	import RadioUnchecked from '$lib/icons/Radio_Unchecked.svelte';
	import CaretUpDown from '$lib/icons/Caret_Up_Down.svelte';
	import Check from '$lib/icons/Check.svelte';
	import { RadioGroup, Select, Label, Button } from 'bits-ui';

	const INCREMENTS = [
		{
			id: 'plus-fifteen-min',
			value: '+0015',
			label: '15m'
		},
		{
			id: 'plus-thirty-min',
			value: '+0030',
			label: '30m'
		},
		{
			id: 'plus-one-hr',
			value: '+0100',
			label: '1hr'
		}
	];

	interface BlockSelectionItem {
		value: string;
		label: string;
	}

	let increment = '+0100';
	export let submitted_increment: string;

	let blocks: Array<string> = createBlocks(increment);
	export let submitted_blocks: Array<string>;

	let start_block_select_items: Array<BlockSelectionItem>;
	let end_block_select_items: Array<BlockSelectionItem>;

	let start_block: BlockSelectionItem;
	let end_block: BlockSelectionItem;
	export let submitted_start_block: string;
	export let submitted_end_block: string;

	// function formatBlocks(blocks: Array<string>, start_time: string, end_time: string) {
	// 	// if starting and ending hour are not in the proper format, default to returning all blocks
	// 	if (start_time.length != 4 || end_time.length != 4) return blocks;

	// 	let start_hour = start_time.slice(0, 2);
	// 	let end_hour = end_time.slice(0, 2);

	// 	if (Number(start_hour) < 0 || Number(start_hour) >= 24) return blocks;
	// 	if (Number(end_hour) < 0 || Number(end_hour) >= 24) return blocks;

	// 	// format the blocks to the submitted start and end times
	// 	while (start_hour != blocks[0].slice(0, 2)) {
	// 		blocks = [...blocks, blocks.shift()!];
	// 	}

	// 	return blocks;
	// }

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

				blocks = [...blocks, hour_value.concat(minute_value)];
			}
		}

		return blocks;
	}

	function createBlockLabel(block: string, is_military_time: boolean, has_leading_zero: boolean) {
		let hour = block.slice(0, 2);
		let minute = block.slice(2);

		if (!is_military_time) {
			minute = minute + (hour < '12' ? 'am' : 'pm');
			hour = Number(hour) % 12 == 0 ? '12' : (Number(hour) % 12).toString();
		}

		if (has_leading_zero) hour = ('0' + hour).slice(-2);
		else hour = Number(hour).toString();

		return hour + ':' + minute;
	}

	function createBlockSelectItems(blocks: Array<string>, is_military_time: boolean, has_leading_zero: boolean) {
		let block_select_items: Array<BlockSelectionItem> = [];

		for (let idx = 0; idx < blocks.length; idx++) {
			if (blocks[idx].slice(2) == '00') {
				let new_block_select_item = {
					value: blocks[idx],
					label: createBlockLabel(blocks[idx], is_military_time, has_leading_zero)
				};
				block_select_items = [...block_select_items, new_block_select_item];
			}
		}

		return block_select_items;
	}

	function isEmpty(obj: Object) {
		for (const prop in obj) {
			if (Object.hasOwn(obj, prop)) {
				return false;
			}
		}
		return true;
	}

	function handleSubmitBlocks() {
		if (isEmpty(start_block) || isEmpty(end_block)) return;

		submitted_increment = increment;
		submitted_start_block = start_block.value;
		submitted_end_block = end_block.value;

		submitted_blocks = blocks;
	}

	$: {
		blocks = createBlocks(increment);

		let block_select_items = createBlockSelectItems(blocks, false, false);

		start_block_select_items = block_select_items;
		end_block_select_items = block_select_items;
	}
</script>

<section class="px-6 py-4 md:px-8">
	<div class="flex flex-col justify-between gap-2 mx-auto md:flex-row md:max-w-3xl">
		<div class="flex flex-row flex-wrap justify-center gap-2 mx-auto">
			<div class="">
				<Select.Root bind:selected={start_block}>
					<Select.Trigger aria-label="Select a start time" class="flex flex-row items-center justify-between gap-2 px-2 py-1 mx-auto text-white rounded-sm min-w-48 bg-neutral-800">
						<Select.Value placeholder="Select a start time" />
						<CaretUpDown class="size-6" />
					</Select.Trigger>

					<Select.Content class="p-2 my-2 overflow-scroll bg-white border outline-none max-h-64">
						{#each start_block_select_items as start_time}
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
			<div class="">
				<Select.Root bind:selected={end_block}>
					<Select.Trigger aria-label="Select an end time" class="flex flex-row items-center justify-between gap-2 px-2 py-1 mx-auto text-white rounded-sm min-w-48 bg-neutral-800">
						<Select.Value placeholder="Select an end time" />
						<CaretUpDown class="size-6" />
					</Select.Trigger>

					<Select.Content class="p-2 my-2 overflow-scroll bg-white border outline-none max-h-64">
						{#each end_block_select_items as end_time}
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
		<div class="flex flex-row flex-wrap justify-center gap-2 mx-auto">
			<div class="">
				<RadioGroup.Root bind:value={increment} class="flex flex-row justify-center gap-2 px-2 py-1 mx-auto text-white rounded-sm w-fit bg-neutral-800">
					{#each INCREMENTS as increment}
						<RadioGroup.Item id={increment.id} value={increment.value} class="flex flex-row items-center [&[data-state=checked]>svg]:hidden">
							<RadioUnchecked />
							<RadioGroup.ItemIndicator><RadioChecked /></RadioGroup.ItemIndicator>
							<Label.Root for={increment.id}>{increment.label}</Label.Root>
						</RadioGroup.Item>
					{/each}
				</RadioGroup.Root>
			</div>
			<div class="flex flex-row items-end justify-center text-white">
				<Button.Root on:click={handleSubmitBlocks} class="px-4 py-1 rounded-sm bg-neutral-800">Build</Button.Root>
			</div>
		</div>
	</div>
</section>
