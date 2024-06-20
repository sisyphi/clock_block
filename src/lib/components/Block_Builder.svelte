<script lang="ts">
	import RadioChecked from '$lib/icons/Radio_Checked.svelte';
	import RadioUnchecked from '$lib/icons/Radio_Unchecked.svelte';
	import CaretUpDown from '$lib/icons/Caret_Up_Down.svelte';
	import Check from '$lib/icons/Check.svelte';
	import { RadioGroup, Select, Label } from 'bits-ui';

	let block_increment = '+0100';
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

	interface Block {
		value: string;
		label: string;
	}

	let start_times: Array<Block>;
	let end_times: Array<Block>;

	function createBlocks(increment: string) {
		let start_times = [];
		let minute_values = ['00', '15', '30', '45'];

		for (let hr = 0; hr <= 23; hr++) {
			let hr_value = ('0' + hr).slice(-2);
			let hr_label = hr % 12 == 0 ? '12' : (hr % 12).toString();

			let min_increment = minute_values.length;
			if (increment == '+0100') min_increment = 4;
			else if (increment == '+0030') min_increment = 2;
			else if (increment == '+0015') min_increment = 1;

			for (let minute_idx = 0; minute_idx < minute_values.length; minute_idx += min_increment) {
				let minute_value = minute_values[minute_idx];

				let block = {
					value: hr_value.concat(minute_value),
					label: hr_label
						.concat(':')
						.concat(minute_value)
						.concat(hr_value < '12' ? 'am' : 'pm')
				};

				start_times.push(block);
			}
		}

		return start_times;
	}

	$: {
		start_times = createBlocks(block_increment);
		end_times = createBlocks(block_increment);
	}
</script>

<div>
	<div class="p-4">
		<h2>Block Increments</h2>
		<RadioGroup.Root bind:value={block_increment}>
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
		<Select.Root>
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
		<Select.Root>
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
