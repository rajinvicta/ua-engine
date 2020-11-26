import Point from '../Core/Geom/Point';
import { Container } from 'pixi.js';
interface IObjectHandler {
  setXy(object: any, x: number, y: number): void;
  setSize(object: any, width: number, height: number): void;
  setPivot(object: any, anchor: Point): void;
  setAngle(object: any, angle: number): void;
 // move(object: any, x: number, y: number): void;
  setX(object: any, x: number): void;
  setY(object: any, y: number): void;
  setScale(object: any, x: number, y: number): void;
  setStyle(text: any, style: any): void;
  setTextColor(text: any, color: string): void;
  destroy(object: any): void;
  setWidth(object: any, width: number): void;
  setHeight(object: any, height: number): void;
  setMask(object: any, mask: any): void;
  getSize(object: any): {width: number, height: number};
  getBounds(object: Container): {x: number, y: number, width: number, height: number};
  getAlpha(object: Container): number;
  setAlpha(object: Container, alpha: number): void;
}

export default IObjectHandler;