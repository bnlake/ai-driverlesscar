import Controls from './controls';
import Road from './road';
import Sensor from './sensor';
import Point from './point';
import { polyIntersect } from './utils';
import Segment from './segment';

export default class Car {
	controls: Controls;
	speed: number;
	maxSpeed: number = 4;
	angle = 0;

	rateOfAcceleration: number;
	rateOfTurn: number = 0.05;
	friction: number = 0.05;
	sensor = new Sensor(this, 5);
	polygon: Array<Segment> = [];
	damaged = false;

	constructor(public x: number, public y: number, public width: number, public height: number) {
		this.controls = new Controls();
		this.speed = 0;
		this.rateOfAcceleration = 0.2;
	}

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		if (this.damaged) ctx.fillStyle = 'gray';
		else ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(this.polygon[0].a.x, this.polygon[0].a.y);
		for (let i = 1; i < this.polygon.length; i++) {
			ctx.lineTo(this.polygon[i].a.x, this.polygon[i].a.y);
		}
		ctx.fill();

		this.sensor.draw(ctx);
	}

	update(road: Road) {
		if (!this.damaged) {
			this.move();
			this.polygon = this.createPolygon();
			this.damaged = this.assessDamage(road);
		}

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

	private createPolygon(): Array<Segment> {
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

		const segments: Array<Segment> = [];
		for (let i = 0; i < points.length; i++) {
			segments.push(new Segment(points[i], points[(i + 1) % points.length]));
		}

		return segments;
	}

	private assessDamage(road: Road): boolean {
		if (polyIntersect(this.polygon, road.borders)) return true;
		return false;
	}
}
