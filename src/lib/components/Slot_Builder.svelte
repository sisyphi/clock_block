<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import Check from '$lib/icons/Check.svelte';

	import { Label, RadioGroup, Button } from 'bits-ui';

	interface Slot {
		name: string;
		color: string;
	}

	let slots: Array<Slot> = [
		{
			name: 'Default',
			color: '#ABABAB'
		}
	];

	let slot_name: string;
	let slot_color: string;

	function addSlot() {
		let idx = slots.findIndex((s) => s.name === slot_name);

		if (slot_name.length <= 0) return;

		if (idx != -1) return;

		let new_slot: Slot = {
			name: slot_name,
			color: slot_color
		};

		slots = [...slots, new_slot];
	}

	function deleteSlot(deleted_slot_name: string) {
		let idx = slots.findIndex((s) => s.name === deleted_slot_name);
		slots.splice(idx, 1);
		slots = slots;
	}

	let active_slot_name: string = 'Default';

	export let active_slot: Slot;

	$: {
		active_slot = slots.filter(function (slot: Slot) {
			return slot.name == active_slot_name;
		})[0];
	}
</script>

<div>
	<div class="flex flex-row items-center gap-4 p-4">
		<input bind:value={slot_name} type="text" placeholder="Enter slot name" />
		<ColorPicker bind:hex={slot_color} />
		<Button.Root on:click={addSlot}><span>Create slot</span></Button.Root>
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
</div>
