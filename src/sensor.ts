import Car from './car';
import Point from './point';
import Touch from './touch';
import Road from './road';
import Segment from './segment';
import { lerp, getIntersection } from './utils';

export default class Sensor {
	public rays: Array<Segment> = [];
	private readings: Array<Touch | undefined> = []; // TODO will most likely be a collection of a custom type

	constructor(private car: Car, public rayCount: number = 3, public rayLength: number = 100) {}

	get raySpread() {
		return Math.PI / 2;
	}

	update(road: Road) {
		this.castRays();
		this.readings = [];
		for (const ray of this.rays) {
			this.readings.push(this.getReading(ray, road.borders));
		}
	}

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		ctx.lineWidth = 2;

		for (let i = 0; i < this.rayCount; i++) {
			const [a, b] = this.rays[i];
			const rayEnd = this.readings[i] ?? b;
			ctx.strokeStyle = 'yellow';
			ctx.beginPath();
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(rayEnd.x, rayEnd.y);
			ctx.stroke();

			ctx.strokeStyle = 'black';
			ctx.beginPath();
			ctx.moveTo(b.x, b.y);
			ctx.lineTo(rayEnd.x, rayEnd.y);
			ctx.stroke();
		}
	}

	private castRays() {
		this.rays = [];

		for (let i = 0; i < this.rayCount; i++) {
			const rayAngle =
				lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)) +
				this.car.angle;

			const start = new Point(this.car.x, this.car.y);
			const end = new Point(
				this.car.x - Math.sin(rayAngle) * this.rayLength,
				this.car.y - Math.cos(rayAngle) * this.rayLength
			);

			this.rays.push(new Segment(start, end));
		}
	}

	private getReading(ray: Segment, segments: Array<Segment>): Touch | undefined {
		const touches: Array<Touch> = [];

		for (const segment of segments) {
			const touch = getIntersection(ray, segment);
			if (touch) touches.push(touch);
		}
		
		if (touches.length === 0) return undefined;
		const minOffset = Math.min(...touches.map((touch) => touch.offset));
		return touches.find((touch) => touch.offset === minOffset);
	}
}
