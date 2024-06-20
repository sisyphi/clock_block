<script lang="ts">
	import SlotBuilder from '$lib/components/Slot_Builder.svelte';
	import RadioChecked from '$lib/icons/Radio_Checked.svelte';
	import RadioUnchecked from '$lib/icons/Radio_Unchecked.svelte';
	import CaretUpDown from '$lib/icons/Caret_Up_Down.svelte';
	import Check from '$lib/icons/Check.svelte';
	import { RadioGroup, Select, Label } from 'bits-ui';

	let block_increment = '+0030';
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

	let start_times = [
		{
			value: '0100',
			label: '1:00am'
		},
		{
			value: '0200',
			label: '2:00am'
		},
		{
			value: '0300',
			label: '3:00am'
		},
		{
			value: '0400',
			label: '4:00am'
		}
	];

	let end_times = [
		{
			value: '0100',
			label: '1:00am'
		},
		{
			value: '0200',
			label: '2:00am'
		},
		{
			value: '0300',
			label: '3:00am'
		},
		{
			value: '0400',
			label: '4:00am'
		}
	];

	function createStartTime(increment: string) {
		// 0000 -> 2359
		// 12am (0am) -> 11am -> 12pm (0pm) -> 11pm

		// 0000, 0030, 0100, 0130, 0200
		start_times = [];

		let minute_values = ['00', '15', '30', '45'];

		for (let hr = 0; hr <= 23; hr++) {
			let hr_value = ('0' + hr).slice(-2);
			let hr_label = '00';

			let min_increment = 4;
			if (increment == '+0030') min_increment = 2;
			if (increment == '+0015') min_increment = 1;

			for (let minute_idx = 0; minute_idx < minute_values.length; minute_idx += min_increment) {
				let timeblock = {
					value: hr_value.concat(minute_values[minute_idx]),
					label: '12:00am'
				};
				start_times.push(timeblock);
			}
		}

		start_times = start_times;
		// console.log(start_times);
	}

	createStartTime(block_increment);
</script>

<section>
	<div>
		<div>
			<h2>Timeblock Increments</h2>
			<RadioGroup.Root bind:value={block_increment}>
				{#each increments as increment, idx}
					<RadioGroup.Item id={increment.id} value={increment.value} class="flex flex-row items-center [&[data-state=checked]>svg]:hidden">
						<!-- <RadioUnchecked class="text-[{'#0022ffa6'}]" /> -->
						<RadioUnchecked />
						<RadioGroup.ItemIndicator><RadioChecked /></RadioGroup.ItemIndicator>
						<Label.Root for={increment.id}>{increment.label}</Label.Root>
					</RadioGroup.Item>
				{/each}
			</RadioGroup.Root>
			<p>Increment: {block_increment}</p>
		</div>
		<div>
			<h2>Start Time</h2>
			<div class="p-4">
				<Select.Root>
					<Select.Trigger aria-label="Select a start time" class="flex flex-row items-center gap-2">
						<Select.Value placeholder="Select a start time" />
						<CaretUpDown class="size-6" />
					</Select.Trigger>

					<Select.Content class="w-full p-2 bg-white border outline-none">
						{#each start_times as start_time}
							<!-- content here -->
							<Select.Item value={start_time.value} label={start_time.label} class="flex flex-row items-center p-2">
								<Label.Root for={start_time.value}>{start_time.label}</Label.Root>
								<Select.ItemIndicator>
									<Check class="size-6" />
								</Select.ItemIndicator>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<div>
			<h2>End Time</h2>
			<div class="p-4">
				<Select.Root>
					<Select.Trigger aria-label="Select a end time" class="flex flex-row items-center gap-2">
						<Select.Value placeholder="Select a end time" />
						<CaretUpDown class="size-6" />
					</Select.Trigger>

					<Select.Content class="w-full p-2 bg-white border outline-none">
						{#each end_times as end_time}
							<!-- content here -->
							<Select.Item value={end_time.value} label={end_time.label} class="flex flex-row items-center p-2">
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
	</div>
	<SlotBuilder></SlotBuilder>
</section>
