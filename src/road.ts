import { lerp } from './utils';

interface Point {
	x: number;
	y: number;
}

type Segment = [Point, Point];

export default class Road {
	infinity = 10000000;

	constructor(public x: number = 0, public laneCount: number = 3, public laneWidth: number = 100) {}

	get left() {
		return this.x - (this.laneCount * this.laneWidth) / 2;
	}

	get right() {
		return this.x + (this.laneCount * this.laneWidth) / 2;
	}

	get top() {
		return -this.infinity;
	}

	get bottom() {
		return this.infinity;
	}

	get topLeft() {
		return { x: this.left, y: this.top };
	}

	get topRight() {
		return { x: this.right, y: this.top };
	}

	get bottomLeft() {
		return { x: this.left, y: this.bottom };
	}

	get bottomRight() {
		return { x: this.right, y: this.bottom };
	}

	get borders(): Array<Segment> {
		return [
			[this.topLeft, this.bottomLeft],
			[this.topRight, this.bottomRight]
		];
	}

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		ctx.lineWidth = 5;
		ctx.strokeStyle = 'white';

		ctx.setLineDash([]);
		for (const segment of this.borders) {
			const [pointA, pointB] = segment;
			ctx.beginPath();
			ctx.moveTo(pointA.x, pointA.y);
			ctx.lineTo(pointB.x, pointB.y);
			ctx.stroke();
		}

		ctx.setLineDash([20, 20]);
		for (let i = 1; i < this.laneCount; i++) {
			const x = lerp(this.left, this.right, i / this.laneCount);

			ctx.beginPath();
			ctx.moveTo(x, this.top);
			ctx.lineTo(x, this.bottom);
			ctx.stroke();
		}
	}

	getLaneCenter(laneIndex: number) {
		if (laneIndex > this.laneCount - 1) return this.left + this.laneWidth / 2;

		return this.left + this.laneWidth / 2 + laneIndex * this.laneWidth;
	}
}
