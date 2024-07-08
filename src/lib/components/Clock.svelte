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

	let clock_timeblocks: Array<Timeblock>;

	$: {
		clock_timeblocks = structuredClone(timeblocks);
		clock_timeblocks = shiftTimeblocks(clock_timeblocks, '0000');
	}

	let num_arcs: number;
	let inc_idx_offset: number;

	function shiftTimeblocks(timeblocks: Array<Timeblock>, start_block: string) {
		let start_hour = start_block.slice(0, 2);

		while (start_hour != timeblocks[0].block.slice(0, 2)) {
			let first_el = timeblocks.shift()!;
			timeblocks.push(first_el);
			timeblocks = timeblocks;
		}

		return timeblocks;
	}

	function updateIncrement(increment: string) {
		let num_arcs: number;
		switch (increment) {
			case '+0100':
				num_arcs = 24;
				inc_idx_offset = 4;
				break;
			case '+0030':
				num_arcs = 48;
				inc_idx_offset = 2;
				break;
			case '+0015':
				num_arcs = 96;
				inc_idx_offset = 1;
				break;
			default:
				num_arcs = 24;
				inc_idx_offset = 4;
		}
		return [num_arcs, inc_idx_offset];
	}

	let size = 280;

	let width = size;
	let height = size;

	let offwhite = '#E8E5DE';
	let offblack = '#333333';

	let increment_arr: Array<number>;

	$: {
		increment_arr = updateIncrement(increment);
		num_arcs = increment_arr[0];
		inc_idx_offset = increment_arr[1];
	}

	const sketch: Sketch = (p5) => {
		p5.setup = () => {
			p5.createCanvas(width * 1.1, height * 2.1);
			p5.background(offwhite);
			// p5.noStroke();
			p5.stroke(offblack);

			p5.fill(offwhite);
			p5.strokeWeight(2);
			p5.strokeCap(p5.ROUND);

			p5.pixelDensity(10);
		};

		p5.draw = () => {
			drawClock();
		};

		function drawClock() {
			let arc_theta = (p5.TWO_PI / num_arcs) * 2;

			let timeblock_idx: number = 0;
			let arc_start: number;
			let origin: Array<number> = [p5.width / 2, p5.height / 2];

			for (let arc_ctr = 0; arc_ctr < num_arcs; arc_ctr++) {
				timeblock_idx = arc_ctr * inc_idx_offset;
				arc_start = -p5.PI / 2 + arc_theta * Number(clock_timeblocks[0].block.slice(0, 2)) + arc_theta * arc_ctr;

				if (arc_ctr < num_arcs / 2) {
					origin[0] = p5.width / 2;
					origin[1] = (p5.height / 4) * 1;
				} else {
					origin[0] = p5.width / 2;
					origin[1] = (p5.height / 4) * 3;
				}

				p5.push();
				p5.translate(origin[0], origin[1]);

				if (clock_timeblocks[timeblock_idx].active_on_timetable) {
					p5.fill(clock_timeblocks[timeblock_idx].active_slot.color);
				} else {
					p5.fill(offwhite);
				}

				if (arc_ctr < num_arcs / 2) {
					p5.arc(0, 0, width, height, arc_start, arc_start + arc_theta);
				} else {
					p5.arc(0, 0, width, height, arc_start, arc_start + arc_theta);
				}

				p5.pop();

				arc_start += arc_theta;
			}

			let tick_len = size * 0.475;

			for (let arc_ctr = 0; arc_ctr < num_arcs; arc_ctr++) {
				timeblock_idx = arc_ctr * inc_idx_offset;
				arc_start = -p5.PI / 2 + arc_theta * Number(clock_timeblocks[0].block.slice(0, 2)) + arc_theta * arc_ctr;

				if (arc_ctr < num_arcs / 2) {
					origin[0] = p5.width / 2;
					origin[1] = (p5.height / 4) * 1;
				} else {
					origin[0] = p5.width / 2;
					origin[1] = (p5.height / 4) * 3;
				}

				p5.push();
				p5.translate(origin[0], origin[1]);

				p5.line(tick_len * p5.cos(arc_start), tick_len * p5.sin(arc_start), (width / 2) * p5.cos(arc_start), (height / 2) * p5.sin(arc_start));

				p5.pop();
			}

			for (let arc_ctr = 0; arc_ctr < num_arcs; arc_ctr++) {
				let am_pm_offset: number = 0;
				let timeblock_idx = arc_ctr * inc_idx_offset;
				arc_start = -p5.PI / 2 + arc_theta * Number(clock_timeblocks[0].block.slice(0, 2)) + arc_theta * arc_ctr;

				if (arc_ctr < num_arcs / 2) {
					am_pm_offset = 0;
					origin[0] = p5.width / 2;
					origin[1] = (p5.height / 4) * 1;
				} else {
					am_pm_offset = num_arcs / 2;
					origin[0] = p5.width / 2;
					origin[1] = (p5.height / 4) * 3;
				}

				p5.push();
				p5.translate(origin[0], origin[1]);

				let curr_active_slot_name: string = clock_timeblocks[timeblock_idx].active_slot.name;
				let next_timeblock_idx: number = (((arc_ctr + 1) % (num_arcs / 2)) + am_pm_offset) * inc_idx_offset;
				let next_active_slot_name: string = clock_timeblocks[next_timeblock_idx].active_slot.name;

				if (curr_active_slot_name != next_active_slot_name) {
					p5.line(0, 0, (width / 2) * p5.cos(arc_start + arc_theta), (height / 2) * p5.sin(arc_start + arc_theta));
				}

				p5.pop();
			}

			// arc_start = -p5.PI / 2 + arc_theta * Number(clock_timeblocks[0].block.slice(0, 2));
			// p5.push();
			// p5.translate(p5.width / 2, (p5.height / 4) * 1);
			// p5.line(0, 0, (width / 2) * p5.cos(arc_start), (height / 2) * p5.sin(arc_start));
			// p5.pop();

			// p5.push();
			// p5.translate(p5.width / 2, (p5.height / 4) * 3);
			// p5.line(0, 0, (width / 2) * p5.cos(arc_start), (height / 2) * p5.sin(arc_start));
			// p5.pop();

			p5.fill(offblack);
			p5.circle(p5.width / 2, (p5.height / 4) * 1, 7.5);
			p5.circle(p5.width / 2, (p5.height / 4) * 3, 7.5);
		}
	};
</script>

<P5 {sketch} />
