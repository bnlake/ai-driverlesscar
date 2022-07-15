import Car from './car';
import { ControlType } from './controls';
import Road from './road';
import Visualizer from './neural/visualizer';
import './style.css';

const carCanvas = document.getElementById('carCanvas') as HTMLCanvasElement;
const networkCanvas = document.getElementById('networkCanvas') as HTMLCanvasElement;

const laneCount = 4;
const laneWidth = 70;
const laneMargin = 20;
const carWidth = laneWidth - laneMargin;
const carHeight = laneWidth * 1.6;

carCanvas.width = laneCount * laneWidth + 20;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, laneCount, laneWidth);
const car = new Car(road.getLaneCenter(1), 100, carWidth, carHeight, ControlType.AI, 6);
const traffic: Array<Car> = [new Car(road.getLaneCenter(1), -100, carWidth, carHeight, ControlType.None)];

function animate() {
	carCanvas.height = networkCanvas.height = window.innerHeight;
	for (const car of traffic) car.update(road, []);
	car.update(road, traffic);

	carCtx?.save();
	carCtx?.translate(0, -car.y + carCanvas.height * 0.7);

	road.draw(carCtx);

	for (const car of traffic) car.draw(carCtx, 'red');
	car.draw(carCtx, 'blue');
	carCtx?.restore();

	Visualizer.drawNetwork(networkCtx, car.brain);
	requestAnimationFrame(animate);
}

animate();
