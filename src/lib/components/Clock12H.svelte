<script lang="ts">
	import P5, { type Sketch } from 'p5-svelte';

	interface Slot {
		name: string;
		color: string;
	}

	interface Timeblock {
		active_on_timetable: boolean;
		block: string;
		slot: Slot;
		active_slot: Slot;
	}

	export let timeblocks: Array<Timeblock>;
	export let increment: string;

	let increment_arr: Array<number>;
	let num_arcs: number;
	let inc_idx_offset: number;

	function updateIncrement(increment: string) {
		let num_arcs: number;
		let inc_idx_offset: number;

		switch (increment) {
			case '+0100':
				num_arcs = 12;
				inc_idx_offset = 4;
				break;
			case '+0030':
				num_arcs = 24;
				inc_idx_offset = 2;
				break;
			case '+0015':
				num_arcs = 48;
				inc_idx_offset = 1;
				break;
			default:
				num_arcs = 12;
				inc_idx_offset = 4;
		}
		return [num_arcs, inc_idx_offset];
	}

	$: {
		increment_arr = updateIncrement(increment);
		num_arcs = increment_arr[0];
		inc_idx_offset = increment_arr[1];
	}

	const sketch: Sketch = (p5) => {
		let size: number = 250;
		let offwhite: string = '#E8E5DE';
		let offblack: string = '#333333';

		p5.setup = () => {
			p5.createCanvas(size * 1.1, size * 1.1);

			p5.background(offwhite);
			p5.fill(offwhite);

			p5.stroke(offblack);
			p5.strokeWeight(2);
			p5.strokeCap(p5.ROUND);

			p5.pixelDensity(10);
		};

		p5.draw = () => {
			drawClock();
		};

		function drawClock() {
			let start_theta: number = -p5.PI / 2;
			let arc_start: number = start_theta;
			let arc_theta: number = p5.TWO_PI / num_arcs;

			let timeblock_idx: number = 0;

			let mark_len = size * 0.475;

			p5.push();
			p5.translate(p5.width / 2, p5.height / 2);

			// Creates the colored sections of the clock
			for (let arc_ctr = 0; arc_ctr < num_arcs; arc_ctr++) {
				timeblock_idx = arc_ctr * inc_idx_offset;
				arc_start = start_theta + arc_ctr * arc_theta;

				p5.fill(timeblocks[timeblock_idx].active_slot.color);
				p5.arc(0, 0, size, size, arc_start, arc_start + arc_theta);
			}

			// Creates the marks on the clock
			for (let arc_ctr = 0; arc_ctr < num_arcs; arc_ctr++) {
				timeblock_idx = arc_ctr * inc_idx_offset;
				arc_start = start_theta + arc_ctr * arc_theta;

				p5.line(mark_len * p5.cos(arc_start), mark_len * p5.sin(arc_start), (size / 2) * p5.cos(arc_start), (size / 2) * p5.sin(arc_start));
			}

			// Creates the slot borders on the clock
			for (let arc_ctr = 0; arc_ctr < num_arcs; arc_ctr++) {
				timeblock_idx = arc_ctr * inc_idx_offset;
				arc_start = start_theta + arc_ctr * arc_theta;

				let curr_active_slot_name: string = timeblocks[timeblock_idx].active_slot.name;
				let next_active_slot_name: string = timeblocks[(timeblock_idx + inc_idx_offset) % timeblocks.length].active_slot.name;

				if (curr_active_slot_name != next_active_slot_name) {
					p5.line(0, 0, (size / 2) * p5.cos(arc_start + arc_theta), (size / 2) * p5.sin(arc_start + arc_theta));
				}
			}

			// Creates the center dot to indicate the hands
			p5.fill(offblack);
			p5.circle(0, 0, 7.5);

			p5.pop();
		}
	};
</script>

<P5 {sketch} />
