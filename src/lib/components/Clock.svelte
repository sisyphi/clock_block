<script lang="ts">
	import P5, { type Sketch } from 'p5-svelte';

	let size = 240;

	let width = size;
	let height = size;

	let offwhite = '#E8E5DE';
	let offblack = '#333333';

	const sketch: Sketch = (p5) => {
		p5.setup = () => {
			p5.createCanvas(width * 1.1, height * 1.1);
			p5.background(offwhite);
			p5.stroke(offblack);

			p5.fill(offwhite);
			p5.strokeWeight(2);
			p5.arc(p5.width / 2, p5.height / 2, width, height, 0, 2 * p5.PI);
		};

		// p5.draw = () => {
		// 	p5.fill(offwhite);
		// 	p5.strokeWeight(2);
		// 	p5.arc(p5.width / 2, p5.height / 2, width, height, 0, 2 * p5.PI);
		// };
	};
</script>

<P5 {sketch} />
