import Controls from './controls';

export default class Car {
	constructor(public x: number, public y: number, public width: number, public height: number) {
		this.controls = new Controls();
	}

	controls: Controls;

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		ctx.beginPath();
		ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
		ctx.fill();
	}

	update() {
		if (this.controls.forward) this.y -= 2;
		if (this.controls.reverse) this.y += 2;
	}
}
