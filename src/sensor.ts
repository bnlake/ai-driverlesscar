import Car from './car';
import Point from './point';
import Road from './road';
import Segment from './segment';
import { lerp } from './utils';

export default class Sensor {
	public rays: Array<Segment> = [];

	constructor(private car: Car, public rayCount: number = 3, public rayLength: number = 100) {}

	get raySpread() {
		return Math.PI / 2;
	}

	update(road: Road) {
		this.castRays();
	}

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		ctx.lineWidth = 2;
		ctx.strokeStyle = 'yellow';

		for (const segment of this.rays) {
			const [a, b] = segment;
			ctx.beginPath();
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
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
}
