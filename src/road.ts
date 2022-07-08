import { lerp } from './utils';

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

	draw(ctx: CanvasRenderingContext2D | null) {
		if (!ctx) return;

		ctx.lineWidth = 5;
		ctx.strokeStyle = 'white';

		for (let i = 0; i <= this.laneCount; i++) {
			const x = lerp(this.left, this.right, i / this.laneCount);

			ctx.beginPath();
			ctx.moveTo(x, this.top);
			ctx.lineTo(x, this.bottom);
			ctx.stroke();
		}
	}
}
