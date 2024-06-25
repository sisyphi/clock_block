<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import ColorPickerInput from './ColorPickerInput.svelte';
	import Check from '$lib/icons/Check.svelte';

	import { Label, RadioGroup, Button } from 'bits-ui';

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
	<div class="flex flex-row items-center gap-4 p-4">
		<input bind:value={slot_name_input} type="text" placeholder="Enter slot name" />
		<ColorPicker label="" bind:hex={slot_color_input} components={{ input: ColorPickerInput }} />
		<Button.Root on:click={() => createSlot(slot_name_input, slot_color_input)}><span>Create slot</span></Button.Root>
	</div>
	<div>
		<RadioGroup.Root bind:value={active_slot_name}>
			{#each slots as slot, idx}
				<div style:background-color={slot.color}>
					<RadioGroup.Item id={slot.name.toLowerCase().replaceAll(' ', '-')} value={slot.name} class="flex flex-row items-center gap-4 p-4 hover:border-4 [&[data-state=checked]>svg]:hidden">
						<Label.Root for={slot.name.toLowerCase().replaceAll(' ', '-')}>{slot.name}</Label.Root>
						<RadioGroup.ItemIndicator><Check class="size-6" /></RadioGroup.ItemIndicator>

						<ColorPicker bind:hex={slot.color} />
						{#if idx != 0}
							<Button.Root on:click={() => deleteSlot(slot.name)}><span>Delete slot</span></Button.Root>
						{/if}
					</RadioGroup.Item>
				</div>
			{/each}
		</RadioGroup.Root>
	</div>
</section>
