import Controls, { ControlType } from './controls';
import Sensor from './sensor';
import { CarColor } from './types';
import { polyIntersect } from './utils';
import Point from './point';
import Road from './road';
import NeuralNetwork from './neural/network';

export default class Car {
	x: number;
	y: number;
	width: number;
	height: number;
	polygon: Array<Point> | undefined;

	speed: number;
	acceleration: number;
	maxSpeed: number;

	friction: number;
	angle: number;
	damaged: boolean;

	sensor: Sensor | undefined;
	controls: Controls;
	brain: NeuralNetwork | null = null;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		public controlType: ControlType,
		maxSpeed: number = 3
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.speed = 0;
		this.acceleration = 0.2;
		this.maxSpeed = maxSpeed;
		this.friction = 0.05;
		this.angle = 0;
		this.damaged = false;

		if (controlType !== ControlType.None) {
			this.sensor = new Sensor(this);
			this.brain = new NeuralNetwork([this.sensor?.rayCount ?? 0, 6, 4]);
		}

		this.controls = new Controls(controlType);
	}

	get useBrain() {
		return this.controlType === ControlType.AI;
	}

	update(road: Road, traffic: Array<Car>) {
		if (!this.damaged) {
			this.move();
			this.polygon = this.createPolygon();
			this.damaged = this.assessDamage(road, traffic);
		}
		if (this.sensor) {
			this.sensor.update(road, traffic);
			const offsets = this.sensor.readings.map((s) => (s?.offset ? 1 - s?.offset : 0)); // Turn sensor readings into 1 | 0's
			const outputs = NeuralNetwork.feedForward(offsets, this.brain);

			if (this.useBrain) {
				this.controls.forward = outputs?.[0] === 1 ? true : false;
				this.controls.left = outputs?.[1] === 1 ? true : false;
				this.controls.right = outputs?.[2] === 1 ? true : false;
				this.controls.reverse = outputs?.[3] === 1 ? true : false;
			}
		}
	}

	private assessDamage(road: Road, traffic: Array<Car>) {
		if (!this.polygon) return false;

		for (let i = 0; i < road.borders.length; i++) {
			if (polyIntersect(this.polygon, road.borders[i])) {
				return true;
			}
		}
		for (let i = 0; i < traffic.length; i++) {
			const car = traffic[i];

			if (car.polygon) {
				if (polyIntersect(this.polygon, car.polygon)) {
					return true;
				}
			}
		}
		return false;
	}

	private createPolygon(): Array<Point> {
		const points: Array<Point> = [];
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

	private move() {
		if (this.controls.forward) {
			this.speed += this.acceleration;
		}
		if (this.controls.reverse) {
			this.speed -= this.acceleration;
		}

		if (this.speed > this.maxSpeed) {
			this.speed = this.maxSpeed;
		}
		if (this.speed < -this.maxSpeed / 2) {
			this.speed = -this.maxSpeed / 2;
		}

		if (this.speed > 0) {
			this.speed -= this.friction;
		}
		if (this.speed < 0) {
			this.speed += this.friction;
		}
		if (Math.abs(this.speed) < this.friction) {
			this.speed = 0;
		}

		if (this.speed !== 0) {
			const flip = this.speed > 0 ? 1 : -1;
			if (this.controls.left) {
				this.angle += 0.03 * flip;
			}
			if (this.controls.right) {
				this.angle -= 0.03 * flip;
			}
		}

		this.x -= Math.sin(this.angle) * this.speed;
		this.y -= Math.cos(this.angle) * this.speed;
	}

	draw(ctx: CanvasRenderingContext2D | null, color: CarColor) {
		if (!this.polygon || !ctx) return;

		if (this.damaged) {
			ctx.fillStyle = 'gray';
		} else {
			ctx.fillStyle = color;
		}
		ctx.beginPath();
		ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
		for (let i = 1; i < this.polygon.length; i++) {
			ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
		}
		ctx.fill();

		if (this.sensor) {
			this.sensor.draw(ctx);
		}
	}
}
