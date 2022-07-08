import Controls from './controls';

export default class Car {
	constructor(private x: number, private y: number, private width: number, private height: number) {
		this.controls = new Controls();
	}

	controls: Controls;

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		ctx.beginPath();
		ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
		ctx.fill();
	}
}
