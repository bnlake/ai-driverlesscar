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
const cars = generateCars(100);
const traffic: Array<Car> = [new Car(road.getLaneCenter(1), -100, carWidth, carHeight, ControlType.None)];

animate();

function animate(time: number = 0) {
	if (!carCtx || !networkCtx) return;

	carCanvas.height = networkCanvas.height = window.innerHeight;
	for (const car of traffic) car.update(road, []);
	for (const car of cars) car.update(road, traffic);
	const bestCar = cars.find((car) => car.y === Math.min(...cars.map((car) => car.y)));

	carCtx?.save();
	carCtx?.translate(0, -(bestCar?.y ?? cars[0].y) + carCanvas.height * 0.7);

	road.draw(carCtx);

	for (const car of traffic) car.draw(carCtx, 'red');
	carCtx.globalAlpha = 0.2;
	for (const car of cars) car.draw(carCtx, 'blue');
	carCtx.globalAlpha = 1;
	bestCar?.draw(carCtx, 'blue', true);
	carCtx?.restore();

	networkCtx.lineDashOffset = -time / 40;
	Visualizer.drawNetwork(networkCtx, bestCar?.brain ?? cars[0].brain);
	requestAnimationFrame(animate);
}

function generateCars(n: number) {
	const cars: Array<Car> = [];

	for (let i = 1; i <= n; i++) {
		cars.push(new Car(road.getLaneCenter(1), 100, carWidth, carHeight, ControlType.AI, 6));
	}

	return cars;
}
