/**
 * Linear interpolation function
 * @url https://en.wikipedia.org/wiki/Linear_interpolation
 */
export function lerp(leftLimit: number, rightLimit: number, percentage: number): number {
	return leftLimit + (rightLimit - leftLimit) * percentage;
}
