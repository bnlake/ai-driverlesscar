import { lerp } from './utils';
import Point from './point';

export default class Road {
	private infinity = 1000000;

	x: number;

	laneCount: number;
	laneWidth: number;

	constructor(x: number, laneCount = 3, laneWidth: number = 70) {
		this.x = x;
		this.laneWidth = laneWidth;
		this.laneCount = laneCount;
	}

	get width() {
		return this.laneCount * this.laneWidth;
	}

	get top() {
		return -this.infinity;
	}

	get bottom() {
		return this.infinity;
	}

	get left() {
		return this.x - this.width / 2;
	}
	get right() {
		return this.x + this.width / 2;
	}

	get borders(): Array<Array<Point>> {
		const topLeft = new Point(this.left, this.top);
		const topRight = new Point(this.right, this.top);
		const bottomLeft = new Point(this.left, this.bottom);
		const bottomRight = new Point(this.right, this.bottom);
		return [
			[topLeft, bottomLeft],
			[topRight, bottomRight]
		];
	}

	getLaneCenter(laneIndex: number) {
		const laneWidth = this.width / this.laneCount;
		return this.left + laneWidth / 2 + Math.min(laneIndex, this.laneCount - 1) * laneWidth;
	}

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		ctx.lineWidth = 5;
		ctx.strokeStyle = 'white';

		for (let i = 1; i <= this.laneCount - 1; i++) {
			const x = lerp(this.left, this.right, i / this.laneCount);

			ctx.setLineDash([20, 20]);
			ctx.beginPath();
			ctx.moveTo(x, this.top);
			ctx.lineTo(x, this.bottom);
			ctx.stroke();
		}

		ctx.setLineDash([]);
		this.borders.forEach((border) => {
			ctx.beginPath();
			ctx.moveTo(border[0].x, border[0].y);
			ctx.lineTo(border[1].x, border[1].y);
			ctx.stroke();
		});
	}
}
