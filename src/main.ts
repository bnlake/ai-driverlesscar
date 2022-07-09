import Car from './car';
import Road from './road';
import './style.css';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const laneCount = 3;
const laneWidth = 70;
canvas.width = laneCount * laneWidth + 20;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, laneCount, laneWidth);
const laneMargin = 20;
const car = new Car(road.getLaneCenter(0), 100, laneWidth - laneMargin, (laneWidth - laneMargin) * 1.6);

function animate() {
	canvas.height = window.innerHeight;
	car.update(road);

	ctx?.save();
	ctx?.translate(0, -car.y + canvas.height * 0.7);

	road.draw(ctx);
	car.draw(ctx);

	ctx?.restore();
	requestAnimationFrame(animate);
}

animate();
