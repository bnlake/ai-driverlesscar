import Controls from './controls';
import Road from './road';
import Sensor from './sensor';
import Point from './point';

export default class Car {
	controls: Controls;
	speed: number;
	maxSpeed: number = 3;
	angle = 0;

	rateOfAcceleration: number;
	rateOfTurn: number = 0.05;
	friction: number = 0.05;
	sensor = new Sensor(this, 5);
	polygon: Array<Point> = [];

	constructor(public x: number, public y: number, public width: number, public height: number) {
		this.controls = new Controls();
		this.speed = 0;
		this.rateOfAcceleration = 0.2;
	}

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		ctx.beginPath();
		ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
		for (let i = 1; i < this.polygon.length; i++) {
			ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
		}
		ctx.fill();

		this.sensor.draw(ctx);
	}

	update(road: Road) {
		this.move();
		this.polygon = this.createPolygon();
		this.sensor.update(road);
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

	private createPolygon(): Array<Point> {
		const points = [];
		const rad = Math.hypot(this.width, this.height) / 2;
		const alpha = Math.atan2(this.width, this.height);

		points.push(
			new Point(this.x - Math.sin(this.angle - alpha) * rad, this.y - Math.cos(this.angle - alpha) * rad)
		);
		points.push(
			new Point(this.x - Math.sin(this.angle + alpha) * rad, this.y - Math.cos(this.angle + alpha) * rad)
		);
		points.push(
			new Point(
				this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
				this.y - Math.cos(Math.PI + this.angle - alpha) * rad
			)
		);
		points.push(
			new Point(
				this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
				this.y - Math.cos(Math.PI + this.angle + alpha) * rad
			)
		);

		return points;
	}
}
