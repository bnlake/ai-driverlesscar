import Car from './car';
import Point from './point';
import Touch from './touch';
import Road from './road';
import { lerp, getIntersection } from './utils';

export default class Sensor {
	car: Car;
	rayCount: number;
	rayLength: number;

	rays: Array<Array<Point>>;
	readings: Array<Touch | null>;

	constructor(car: Car) {
		this.car = car;
		this.rayCount = 5;
		this.rayLength = 150;

		this.rays = [];
		this.readings = [];
	}

	get raySpread() {
		return Math.PI / 2;
	}

	update(road: Road, traffic: Array<Car>) {
		this.castRays();
		this.readings = [];
		for (let i = 0; i < this.rays.length; i++) {
			this.readings.push(this.getReading(this.rays[i], road, traffic));
		}
	}

	/**
	 *
	 * @param ray
	 * @param road
	 * @param traffic
	 * @returns
	 */
	private getReading(ray: Array<Point>, road: Road, traffic: Array<Car>): Touch | null {
		let touches = [];

		for (let i = 0; i < road.borders.length; i++) {
			const touch = getIntersection(ray[0], ray[1], road.borders[i][0], road.borders[i][1]);
			if (touch) {
				touches.push(touch);
			}
		}

		for (let i = 0; i < traffic.length; i++) {
			const poly = traffic[i].polygon;
			if (!poly) continue;

			for (let j = 0; j < poly.length; j++) {
				const value = getIntersection(ray[0], ray[1], poly[j], poly[(j + 1) % poly.length]);
				if (value) {
					touches.push(value);
				}
			}
		}

		if (touches.length == 0) {
			return null;
		} else {
			const offsets = touches.map((e) => e.offset);
			const minOffset = Math.min(...offsets);
			return touches.find((e) => e.offset == minOffset) ?? null;
		}
	}

	private castRays() {
		this.rays = [];
		for (let i = 0; i < this.rayCount; i++) {
			const rayAngle =
				lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)) +
				this.car.angle;

			const start = { x: this.car.x, y: this.car.y };
			const end = {
				x: this.car.x - Math.sin(rayAngle) * this.rayLength,
				y: this.car.y - Math.cos(rayAngle) * this.rayLength
			};
			this.rays.push([start, end]);
		}
	}

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		for (let i = 0; i < this.rayCount; i++) {
			let end: Point = this.rays[i][1];
			const reading = this.readings[i];
			if (reading) {
				end = reading;
			}

			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'yellow';
			ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
			ctx.lineTo(end.x, end.y);
			ctx.stroke();

			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'black';
			ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
			ctx.lineTo(end.x, end.y);
			ctx.stroke();
		}
	}
}
