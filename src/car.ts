import Controls from './controls';

export default class Car {
	controls: Controls;
	speed: number;
	rateOfAcceleration: number;

	constructor(public x: number, public y: number, public width: number, public height: number) {
		this.controls = new Controls();
		this.speed = 0;
		this.rateOfAcceleration = 0.2;
	}

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		ctx.beginPath();
		ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
		ctx.fill();
	}

	update() {
		if (this.controls.forward) this.speed += this.rateOfAcceleration;
		if (this.controls.reverse) this.speed -= this.rateOfAcceleration;
		this.y -= this.speed;
	}
}
