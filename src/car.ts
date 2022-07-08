import Controls from './controls';

export default class Car {
	controls: Controls;
	speed: number;
	maxSpeed: number = 3;
	angle = 0;

	rateOfAcceleration: number;
	rateOfTurn: number = 0.05;
	friction: number = 0.05;

	constructor(public x: number, public y: number, public width: number, public height: number) {
		this.controls = new Controls();
		this.speed = 0;
		this.rateOfAcceleration = 0.2;
	}

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(-this.angle);

		ctx.beginPath();
		ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
		ctx.fill();

		ctx.restore();
	}

	update() {
		this.move();
	}

	private move() {
		if (this.controls.forward && this.speed < this.maxSpeed) this.speed += this.rateOfAcceleration;
		if (this.controls.reverse && this.speed > -this.maxSpeed) this.speed -= this.rateOfAcceleration;

		if (this.speed !== 0) {
			const flip = this.speed > 0 ? 1 : -1;
			if (this.controls.left) this.angle += this.rateOfTurn * flip;
			if (this.controls.right) this.angle -= this.rateOfTurn * flip;
		}

		if (this.speed > 0) this.speed -= this.friction;
		if (this.speed < 0) this.speed += this.friction;

		if (Math.abs(this.speed) <= this.friction) this.speed = 0;

		this.x -= Math.sin(this.angle) * this.speed;
		this.y -= Math.cos(this.angle) * this.speed;
	}
}
