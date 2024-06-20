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

	interface BlockSelectionOption {
		value: string;
		label: string;
	}

	let start_times: Array<BlockSelectionOption>;
	let end_times: Array<BlockSelectionOption>;

	function createBlocks(increment: string, chosen_start_time: string, chosen_end_time: string) {
		// TODO
		// refactor: include start_time and end_time in the creation
		// question: should I be able to start on weird increments? (e.g. start at 9:30AM; end at 9:45AM)

		let blocks = [];
		let minute_values = ['00', '15', '30', '45'];

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
		let blocks = createBlocks(increment, '0000', '2400');
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
		start_times = createBlockSelectItems(increment, false, false);
		end_times = createBlockSelectItems(increment, false, false);
	}

	let chosen_start_time = { value: '0900', label: createBlockLabel('0900', false, false) };
	let chosen_end_time = { value: '1700', label: createBlockLabel('1700', false, false) };

	export let chosen_blocks: Array<string>;

	$: {
		chosen_blocks = createBlocks(increment, chosen_start_time.value, chosen_end_time.value);
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
		<Select.Root bind:selected={chosen_start_time}>
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
		<Select.Root bind:selected={chosen_end_time}>
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
