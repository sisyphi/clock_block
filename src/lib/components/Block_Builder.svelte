<script lang="ts">
	import RadioChecked from '$lib/icons/Radio_Checked.svelte';
	import RadioUnchecked from '$lib/icons/Radio_Unchecked.svelte';
	import CaretUpDown from '$lib/icons/Caret_Up_Down.svelte';
	import Check from '$lib/icons/Check.svelte';

	import { RadioGroup, Select, Label } from 'bits-ui';

	function createBlocks() {
		let blocks: Array<string> = [];
		const MINUTE_VALUES: Array<string> = ['00', '15', '30', '45'];

		for (let hour = 0; hour < 24; hour++) {
			let hour_value = ('0' + hour).slice(-2);

			for (let minute_idx = 0; minute_idx < MINUTE_VALUES.length; minute_idx++) {
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
		let block_items: Array<BlockSelectionItem> = [];

		for (let idx = 0; idx < blocks.length; idx++) {
			if (blocks[idx].slice(2) == '00') {
				let new_block_item = {
					value: blocks[idx],
					label: createBlockLabel(blocks[idx], is_military_time, has_leading_zero)
				};
				block_items = [...block_items, new_block_item];
			}
		}

		return block_items;
	}

	function isEmpty(obj: Object) {
		for (const prop in obj) {
			if (Object.hasOwn(obj, prop)) {
				return false;
			}
		}
		return true;
	}

	function updateBlocks(increment: string) {
		let updated_blocks = createBlocks();

		return updated_blocks;
	}

	const INCREMENTS = [
		{
			id: 'plus-fifteen-min',
			value: '+0015',
			label: '+15m'
		},
		{
			id: 'plus-thirty-min',
			value: '+0030',
			label: '+30m'
		},
		{
			id: 'plus-one-hr',
			value: '+0100',
			label: '+1hr'
		}
	];

	interface BlockSelectionItem {
		value: string;
		label: string;
	}

	export let increment = '+0100';

	export let blocks: Array<string> = createBlocks();

	let start_block_items: Array<BlockSelectionItem> = createBlockSelectItems(blocks, false, false);
	let end_block_items: Array<BlockSelectionItem> = createBlockSelectItems(blocks, false, false);

	let start_block_item: BlockSelectionItem;
	let end_block_item: BlockSelectionItem;
	export let start_block: string = '0900';
	export let end_block: string = '1700';

	$: if (!isEmpty(start_block_item)) start_block = start_block_item.value;
	$: if (!isEmpty(end_block_item)) end_block = end_block_item.value;

	$: blocks = updateBlocks(increment);
</script>

<div class="flex flex-col justify-between w-full max-w-sm gap-2 mx-auto sm:max-w-2xl sm:flex-row">
	<Select.Root bind:selected={start_block_item}>
		<Select.Trigger
			aria-label="Select start time"
			class="w-full px-2 py-1 text-black border-2 rounded-sm bg-offwhite min-w-44 sm:w-52 border-offblack hover:bg-offblack hover:text-offwhite"
		>
			<div class="flex flex-row items-center justify-between mx-auto max-w-52">
				<Select.Value placeholder="Select start time" />
				<CaretUpDown class="-mr-1 size-6" />
			</div>
		</Select.Trigger>

		<Select.Content class="p-2 my-2 overflow-scroll border-2 rounded-sm outline-none bg-offwhite border-offblack max-h-64">
			{#each start_block_items as start_time}
				<Select.Item
					value={start_time.value}
					label={start_time.label}
					class="flex flex-row items-center justify-between p-2 rounded-sm cursor-pointer hover:bg-offblack hover:text-offwhite"
				>
					<Label.Root for={start_time.value}>{start_time.label}</Label.Root>
					<Select.ItemIndicator>
						<Check class="size-6" />
					</Select.ItemIndicator>
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	<Select.Root bind:selected={end_block_item}>
		<Select.Trigger
			aria-label="Select end time"
			class="w-full px-2 py-1 text-black border-2 rounded-sm bg-offwhite min-w-44 sm:w-52 border-offblack hover:bg-offblack hover:text-offwhite"
		>
			<div class="flex flex-row items-center justify-between mx-auto max-w-52">
				<Select.Value placeholder="Select end time" />
				<CaretUpDown class="-mr-1 size-6" />
			</div>
		</Select.Trigger>

		<Select.Content class="p-2 my-2 overflow-scroll border-2 rounded-sm outline-none bg-offwhite border-offblack max-h-64">
			{#each end_block_items as end_time}
				<Select.Item
					value={end_time.value}
					label={end_time.label}
					class="flex flex-row items-center justify-between p-2 rounded-sm cursor-pointer hover:bg-offblack hover:text-offwhite"
				>
					<Label.Root for={end_time.value}>{end_time.label}</Label.Root>
					<Select.ItemIndicator>
						<Check class="size-6" />
					</Select.ItemIndicator>
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	<RadioGroup.Root bind:value={increment} class="flex flex-row justify-center w-full p-1 border-2 rounded-sm sm:w-fit bg-offwhite border-offblack text-offblack">
		{#each INCREMENTS as increment}
			<RadioGroup.Item
				id={increment.id}
				value={increment.value}
				class="flex flex-row items-center px-2 rounded-sm hover:cursor-pointer hover:text-offwhite hover:bg-offblack [&[data-state=checked]>svg]:hidden"
			>
				<RadioUnchecked />
				<RadioGroup.ItemIndicator><RadioChecked /></RadioGroup.ItemIndicator>
				<Label.Root for={increment.id} class="hover:cursor-pointer">{increment.label}</Label.Root>
			</RadioGroup.Item>
		{/each}
	</RadioGroup.Root>
</div>
