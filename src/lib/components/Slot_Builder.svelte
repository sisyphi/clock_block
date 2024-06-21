<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';

	import { Button } from 'bits-ui';

	interface Slot {
		name: string;
		color: string;
	}

	let slots: Array<Slot> = [
		{
			name: 'Work',
			color: '#2B2B2B'
		},
		{
			name: 'Free',
			color: '#321321'
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

		slots = [new_slot, ...slots];
	}

	function deleteSlot(deleted_slot_name: string) {
		let idx = slots.findIndex((s) => s.name === deleted_slot_name);
		slots.splice(idx, 1);
		slots = slots;
	}
</script>

<div>
	<div class="flex flex-row items-center gap-4 p-4">
		<input bind:value={slot_name} type="text" placeholder="Enter slot name" />
		<ColorPicker bind:hex={slot_color} />
		<Button.Root on:click={addSlot}><span>Create slot</span></Button.Root>
	</div>
	<div>
		{#each slots as slot}
			<div style:background-color={slot.color} class="flex flex-row items-center gap-4 p-4">
				<p>{slot.name}</p>
				<ColorPicker bind:hex={slot.color} />
				<Button.Root on:click={() => deleteSlot(slot.name)}><span>Delete slot</span></Button.Root>
			</div>
		{/each}
	</div>
</div>
