<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import ColorPickerInput from './ColorPickerInput.svelte';
	import Check from '$lib/icons/Check.svelte';

	import { Label, RadioGroup, Button } from 'bits-ui';
	import PlusCircle from '$lib/icons/Plus_Circle.svelte';
	import Trash from '$lib/icons/Trash.svelte';

	interface Slot {
		name: string;
		color: string;
	}

	export let default_slot: Slot = {
		name: 'Default',
		color: '#ABABAB'
	};

	export let slots: Array<Slot> = [default_slot];
	let slot_name_input: string;
	let slot_color_input: string;

	export let active_slot: Slot = default_slot;
	let active_slot_name: string = default_slot.name;

	function createSlot(slot_name: string, slot_color: string) {
		let idx = slots.findIndex((s) => s.name === slot_name);

		if (slot_name.length <= 0) return;

		if (idx != -1) return;

		let new_slot: Slot = {
			name: slot_name,
			color: slot_color
		};

		slots = [...slots, new_slot];
	}

	function deleteSlot(slot_name: string) {
		let idx = slots.findIndex((s) => s.name === slot_name);
		slots.splice(idx, 1);
		slots = [...slots];
	}

	$: default_slot = slots[0];

	// updates active_slot when a new slot is picked
	$: {
		active_slot = slots.filter(function (slot: Slot) {
			return slot.name == active_slot_name;
		})[0];
	}
</script>

<section>
	<div class="flex flex-row items-center justify-between gap-4 mx-auto">
		<input bind:value={slot_name_input} type="text" placeholder="Enter slot name" class="flex-grow px-2 py-1 my-2 border-2 rounded-sm min-w-36 border-neutral-800" />
		<div class="flex flex-row items-center gap-4">
			<ColorPicker label="" bind:hex={slot_color_input} components={{ input: ColorPickerInput }} />
			<Button.Root on:click={() => createSlot(slot_name_input, slot_color_input)}>
				<span class="sr-only">Create slot</span>
				<PlusCircle class="size-8"></PlusCircle>
			</Button.Root>
		</div>
	</div>
	<div>
		<RadioGroup.Root bind:value={active_slot_name} class="flex flex-col gap-2">
			{#each slots as slot, idx}
				<div class="flex flex-row items-center justify-between w-full gap-4 mx-auto">
					<RadioGroup.Item id={slot.name.toLowerCase().replaceAll(' ', '-')} value={slot.name} class="flex-grow [&[data-state=checked]>svg]:hidden">
						<div style:background-color={slot.color} class="flex flex-row justify-between px-2 py-1 border-2 rounded-sm min-w-36 border-neutral-800">
							<Label.Root for={slot.name.toLowerCase().replaceAll(' ', '-')}>{slot.name}</Label.Root>
							<RadioGroup.ItemIndicator><Check class="size-6" /></RadioGroup.ItemIndicator>
						</div>
					</RadioGroup.Item>
					<div class="flex flex-row items-center justify-center gap-4">
						<ColorPicker label="" bind:hex={slot.color} components={{ input: ColorPickerInput }} />
						<Button.Root on:click={() => deleteSlot(slot.name)} disabled={idx == 0} class={idx == 0 ? 'opacity-0' : ''}>
							<span class="sr-only">Delete slot</span>
							<Trash class="size-8"></Trash>
						</Button.Root>
					</div>
				</div>
			{/each}
		</RadioGroup.Root>
	</div>
</section>
