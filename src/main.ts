import Car from './car';
import Road from './road';
import './style.css';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, 2, (canvas.width / 2) * 0.9);
const car = new Car(100, 100, 30, 50);

function animate() {
	canvas.height = window.innerHeight;
	car.update();

	road.draw(ctx);
	car.draw(ctx);
	requestAnimationFrame(animate);
}

animate();
