import Car from "./car";
import Road from "./road";
import "./style.css";

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const laneCount = 6;
const laneWidth = 70;
const laneMargin = 20;
const carWidth = laneWidth - laneMargin;
const carHeight = laneWidth * 1.6;

canvas.width = laneCount * laneWidth + 20;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, laneCount, laneWidth);
const car = new Car(road.getLaneCenter(1), 100, carWidth, carHeight, "KEYS", 6);
const traffic: Array<Car> = [
  new Car(road.getLaneCenter(1), -100, carWidth, carHeight, "DUMMY"),
];

function animate() {
  canvas.height = window.innerHeight;
  for (const car of traffic) car.update(road);
  car.update(road);

  ctx?.save();
  ctx?.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);

  car.draw(ctx);
  for (const car of traffic) car.draw(ctx);
  ctx?.restore();
  requestAnimationFrame(animate);
}

animate();
