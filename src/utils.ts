import Segment from './segment';
import Touch from './touch';

/**
 * Linear interpolation function
 * @url https://en.wikipedia.org/wiki/Linear_interpolation
 */
export function lerp(leftLimit: number, rightLimit: number, percentage: number): number {
	return leftLimit + (rightLimit - leftLimit) * percentage;
}

export function getIntersection(segmentA: Segment, segmentB: Segment): Touch | null {
	const [a, b] = segmentA;
	const [c, d] = segmentB;
	const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
	const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - b.x) * (a.y - b.y);
	const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

	if (bottom !== 0) {
		const t = tTop / bottom;
		const u = uTop / bottom;
		if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
			return new Touch(lerp(a.x, b.x, t), lerp(a.y, b.y, t), t);
		}
	}

	return null;
}
