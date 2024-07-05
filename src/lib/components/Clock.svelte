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

	let increment_arc: number;
	let increment_idx: number;

	function updateIncrement(increment: string) {
		let increment_arc: number;
		switch (increment) {
			case '+0100':
				increment_arc = 24;
				increment_idx = 4;
				break;
			case '+0030':
				increment_arc = 48;
				increment_idx = 2;
				break;
			case '+0015':
				increment_arc = 96;
				increment_idx = 1;
				break;
			default:
				increment_arc = 24;
				increment_idx = 4;
		}
		return [increment_arc, increment_idx];
	}

	let size = 280;

	let width = size;
	let height = size;

	let offwhite = '#E8E5DE';
	let offblack = '#333333';

	let increment_arr: Array<number>;

	$: {
		increment_arr = updateIncrement(increment);
		increment_arc = increment_arr[0];
		increment_idx = increment_arr[1];
	}

	const sketch: Sketch = (p5) => {
		p5.setup = () => {
			p5.createCanvas(width * 1.1, height * 1.1);
			p5.background(offwhite);
			// p5.noStroke();
			p5.stroke(offblack);

			p5.fill(offwhite);
			p5.strokeWeight(2);
			p5.strokeCap(p5.ROUND);

			p5.pixelDensity(10);
		};

		p5.draw = () => {
			let section = (2 * p5.PI) / increment_arc;

			let tick_len = size * 0.475;

			let idx: number;
			let start: number;

			start = -p5.PI / 2 + section * Number(timeblocks[0].block.slice(0, 2));
			idx = 0;

			for (let ctr = 0; ctr < increment_arc; ctr++) {
				p5.fill(timeblocks[idx % timeblocks.length].active_slot.color);
				p5.arc(p5.width / 2, p5.height / 2, width, height, start, start + section);

				idx += increment_idx;
				start += section;
			}

			start = -p5.PI / 2 + section * Number(timeblocks[0].block.slice(0, 2));

			for (let ctr = 0; ctr < increment_arc; ctr++) {
				p5.push();
				p5.translate(p5.width / 2, p5.height / 2);
				p5.line(tick_len * p5.cos(start), tick_len * p5.sin(start), (width / 2) * p5.cos(start), (height / 2) * p5.sin(start));
				p5.pop();
				start += section;
			}
		};
	};
</script>

<P5 {sketch} />
