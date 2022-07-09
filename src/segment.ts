import Point from './point';

export default class Segment {
	constructor(public a: Point, public b: Point) {}
	*[Symbol.iterator]() {
		yield this.a;
		yield this.b;
	}
}
