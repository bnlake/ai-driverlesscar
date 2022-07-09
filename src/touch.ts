import Point from './point';

/**
 * A class the describes the direction to a ray intersection
 */
export default class Touch extends Point {
	constructor(x: number, y: number, public offset: number) {
		super(x, y);
	}
}
