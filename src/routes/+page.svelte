<script>
	let slots = [
		{
			name: 'Work',
			color: '#2B2B2B'
		},
		{
			name: 'Free',
			color: '#321321'
		}
	];

	/**
	 * @type {string}
	 */
	let slot_name;

	function addSlot() {
		let idx = slots.findIndex((s) => s.name === slot_name);

		if (idx != -1) return;

		let new_slot = {
			name: slot_name,
			color: '#2B2B2B'
		};

		slots = [new_slot, ...slots];
	}

	/**
	 * @param {string} deleted_slot_name
	 */
	function deleteSlot(deleted_slot_name) {
		let idx = slots.findIndex((s) => s.name === deleted_slot_name);
		slots.splice(idx, 1);
		slots = slots;
	}
</script>

<section>
	<div>
		<div>
			<input bind:value={slot_name} type="text" placeholder="Enter slot name" />
			<button on:click={addSlot} type="button"><span>Create slot</span></button>
		</div>
		<div>
			{#each slots as slot}
				<div>
					<p>{slot.name}</p>
					<button on:click={deleteSlot(slot.name)} type="button">Delete slot</button>
				</div>
			{/each}
		</div>
	</div>
</section>
