import Controls from "./controls";
import Road from "./road";
import Sensor from "./sensor";
import Point from "./point";
import { polyIntersect } from "./utils";
import Segment from "./segment";
import { CarColor, ControlType } from "./types";

export default class Car {
  controls: Controls;
  speed: number;
  maxSpeed: number = 4;
  angle = 0;

  rateOfAcceleration: number;
  rateOfTurn: number = 0.05;
  friction: number = 0.05;
  sensor: Sensor | null = null;
  polygon: Array<Segment> = [];
  damaged = false;

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public controlType: ControlType,
    maxSpeed: number = 4
  ) {
    this.controls = new Controls(controlType);
    this.speed = 0;
    this.maxSpeed = maxSpeed;
    this.rateOfAcceleration = 0.2;
    if (controlType === "KEYS") this.sensor = new Sensor(this, 5);
  }

  draw(ctx: CanvasRenderingContext2D | null, carColor: CarColor) {
    if (!ctx) return;

    if (this.damaged) ctx.fillStyle = "gray";
    else ctx.fillStyle = carColor;
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].a.x, this.polygon[0].a.y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].a.x, this.polygon[i].a.y);
    }
    ctx.fill();

    this.sensor?.draw(ctx);
  }

  update(road: Road, traffic: Array<Car> = []) {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
      this.damaged = this.assessDamage(road, traffic);
    }

    this.sensor?.update(road, traffic);
  }

  private move() {
    if (this.controls.forward && this.speed < this.maxSpeed)
      this.speed += this.rateOfAcceleration;
    if (this.controls.reverse && this.speed > -this.maxSpeed)
      this.speed -= this.rateOfAcceleration;

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) this.angle += this.rateOfTurn * flip;
      if (this.controls.right) this.angle -= this.rateOfTurn * flip;
    }

    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;

    if (Math.abs(this.speed) <= this.friction) this.speed = 0;

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  private createPolygon(): Array<Segment> {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push(
      new Point(
        this.x - Math.sin(this.angle - alpha) * rad,
        this.y - Math.cos(this.angle - alpha) * rad
      )
    );
    points.push(
      new Point(
        this.x - Math.sin(this.angle + alpha) * rad,
        this.y - Math.cos(this.angle + alpha) * rad
      )
    );
    points.push(
      new Point(
        this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
        this.y - Math.cos(Math.PI + this.angle - alpha) * rad
      )
    );
    points.push(
      new Point(
        this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
        this.y - Math.cos(Math.PI + this.angle + alpha) * rad
      )
    );

    const segments: Array<Segment> = [];
    for (let i = 0; i < points.length; i++) {
      segments.push(new Segment(points[i], points[(i + 1) % points.length]));
    }

    return segments;
  }

  private assessDamage(road: Road, traffic: Array<Car>): boolean {
    if (polyIntersect(this.polygon, road.borders)) return true;
    for (const car of traffic)
      if (polyIntersect(this.polygon, car.polygon)) return true;
    return false;
  }
}
