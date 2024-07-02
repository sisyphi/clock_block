<script lang="ts">
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import ColorPickerInput from './ColorPickerInput.svelte';
	import Check from '$lib/icons/Check.svelte';

	import { Label, RadioGroup, Button, type CustomEventHandler } from 'bits-ui';
	import PlusCircle from '$lib/icons/Plus_Circle.svelte';
	import Trash from '$lib/icons/Trash.svelte';
	import RadioChecked from '$lib/icons/Radio_Checked.svelte';
	import RadioUnchecked from '$lib/icons/Radio_Unchecked.svelte';
	import ColorPickerWrapper from './ColorPickerWrapper.svelte';

	interface Slot {
		name: string;
		color: string;
		is_editing?: boolean;
	}

	export let default_slot: Slot = {
		name: 'Default',
		color: '#ABABAB'
	};

	export let slots: Array<Slot> = [
		default_slot,
		{ name: 'Lunch', color: '#ffd000', is_editing: false },
		{ name: 'Dinner', color: '#ffd000', is_editing: false },
		{ name: 'Break', color: '#009dff', is_editing: false },
		{ name: 'Study', color: '#ff0000', is_editing: false }
	];

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
			color: slot_color,
			is_editing: false
		};

		active_slot = new_slot;
		active_slot_name = active_slot.name;

		slots = [...slots, new_slot];
	}

	function deleteSlot(slot_name: string) {
		let idx = slots.findIndex((s) => s.name === slot_name);
		slots.splice(idx, 1);
		active_slot_name = default_slot.name;

		slots = [...slots];
	}

	// function deleteSlotOnBackspace(e: CustomEventHandler<KeyboardEvent, HTMLButtonElement>, slot_name: string) {
	// 	if (e.detail.originalEvent.key != 'Backspace') return;
	// 	let idx = slots.findIndex((s) => s.name === slot_name);
	// 	slots.splice(idx, 1);
	// 	active_slot_name = default_slot.name;

	// 	slots = [...slots];
	// }

	$: default_slot = slots[0];

	$: {
		active_slot = slots.filter(function (slot: Slot) {
			return slot.name == active_slot_name;
		})[0];
	}

	function resetForm() {
		slot_name_input = '';
	}

	function toggleEditing(slot: Slot) {
		slot.is_editing = true;
		slots = [...slots];
	}

	function updateSlot(prev_name: string, next_name: string) {
		let num_similar_slots = slots.filter(function (slot: Slot) {
			return slot.name == next_name;
		}).length;

		if (num_similar_slots >= 1) return;

		let idx = slots.findIndex((s) => s.name === prev_name);
		if (next_name.length > 0 && next_name != 'Default') {
			slots[idx].name = next_name;
			active_slot_name = slots[idx].name;

			slots = [...slots];
		}
	}

	function handleDblClick(event: KeyboardEvent, slot: Slot) {
		let pressed_key = event.key;
		let target_element = event.target as HTMLInputElement;

		switch (pressed_key) {
			case 'Escape':
				target_element.blur();
				break;
			case 'Enter':
				updateSlot(slot.name, target_element.value);
				target_element.blur();
				break;
		}
	}

	function handleBlur(event: FocusEvent, slot: Slot) {
		let target_element = event.target as HTMLInputElement;

		slot.is_editing = false;
		slots = [...slots];

		target_element.blur();
	}
</script>

<section>
	<form on:submit|preventDefault={resetForm}>
		<div class="flex flex-row items-center justify-between gap-2 mx-auto mb-2">
			<input bind:value={slot_name_input} type="text" placeholder="Enter slot name" class="flex-grow px-2 py-1 border-2 rounded-sm min-w-36 border-neutral-800" />
			<div class="flex flex-row items-center gap-2">
				<ColorPicker
					label=""
					bind:hex={slot_color_input}
					sliderDirection="horizontal"
					isDark={true}
					isAlpha={false}
					components={{ ...ChromeVariant, input: ColorPickerInput, wrapper: ColorPickerWrapper }}
				/>
				<Button.Root on:click={() => createSlot(slot_name_input, slot_color_input)}>
					<span class="sr-only">Create slot</span>
					<PlusCircle class="size-6"></PlusCircle>
				</Button.Root>
			</div>
		</div>
	</form>
	<div>
		<RadioGroup.Root bind:value={active_slot_name} class="flex flex-col gap-2">
			{#each slots as slot, idx}
				<RadioGroup.Item
					id={slot.name.toLowerCase().replaceAll(' ', '-')}
					value={slot.name}
					class="flex flex-row items-center gap-2 [&[data-state=checked]>div>div>svg]:hidden [&[data-state=unchecked]>div>div>div>svg]:hidden"
				>
					<div class="flex flex-row items-center justify-start flex-grow gap-1 min-w-36">
						<div style:background-color={slot.color} class="flex flex-row items-center w-full p-1 text-left break-all border-2 whitespace-break-spaces border-neutral-800">
							<RadioUnchecked class="size-6" />
							<div><RadioChecked class="size-6" /></div>
							{#if idx == 0}
								<Label.Root for={slot.name.toLowerCase().replaceAll(' ', '-')} class="mx-1">
									<p>{slot.name}</p></Label.Root
								>
							{:else if !slot.is_editing}
								<Label.Root for={slot.name.toLowerCase().replaceAll(' ', '-')} class="mx-1">
									<p on:dblclick={() => toggleEditing(slot)}>{slot.name}</p></Label.Root
								>
							{:else}
								<!-- svelte-ignore a11y-autofocus -->
								<input
									on:keydown={(event) => handleDblClick(event, slot)}
									on:blur={(event) => handleBlur(event, slot)}
									type="text"
									value={slot.name}
									autofocus
									class="px-2 mx-1 rounded-sm"
								/>
							{/if}
						</div>
					</div>
					<div class="flex flex-row items-center justify-center gap-2">
						<ColorPicker
							label=""
							bind:hex={slot.color}
							sliderDirection="horizontal"
							isAlpha={false}
							isTextInput={false}
							components={{ ...ChromeVariant, input: ColorPickerInput }}
							--focus-color="grey"
						/>
						<Button.Root on:click={() => deleteSlot(slot.name)} disabled={idx == 0} class={idx == 0 ? 'opacity-0' : ''}>
							<span class="sr-only">Delete slot</span>
							<Trash class="size-6"></Trash>
						</Button.Root>
					</div>
				</RadioGroup.Item>
			{/each}
		</RadioGroup.Root>
	</div>
</section>
