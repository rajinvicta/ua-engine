import IObjectHandler from './IObjectHandler';
import Point from '../Core/Geom/Point';
import { Container, DisplayObject } from 'pixi.js';

class ObjectHandler implements IObjectHandler {
  constructor() {

  }

  public setXy(object: any, x: number, y: number) {
    object.x = parseInt(<any>x);
    object.y = parseInt(<any>y);
  }

  public setPivot(object: Container, anchor: Point) {
    object.pivot.set(Math.floor(anchor.x * object.width), Math.floor(anchor.y * object.height));
  }

  public setAngle(object: Container, angle: number){
    object.angle = angle;
  }

  public setSize(object: Container, width: number, height: number) {
    this.setWidth(object, width)
    this.setHeight(object, height);
  }

  public setStyle(text: any, style: any) {
    text.style = style;
  }

  public setTextColor(text: any, color: string) {
    text.fill = color;
  }

  public move(object: Container, x: number, y: number) {
    this.setXy(object, parseInt(<any>x), parseInt(<any>y));
  }

  public setX(object: any, x: number) {
    object.x = parseInt(<any>x);
  }

  public setY(object: any, y: number) {
    object.y = parseInt(<any>y);
  }

  public setScale(object: any, x: number, y: number) {
    object.scale.set(x, y);
  }

  public setWidth(object: any, width: number) {
    object.width = parseInt(<any>width);
  }

  public setHeight(object: any, height: number) {
    object.height = parseInt(<any>height);
  }

  public destroy(object: any) {
    object.destroy();
  }

  public setMask(object: any, mask: any) {
    object.mask = mask;
  }

  public getSize(object: any): { width: number, height: number } {
    return { width: object.width, height: object.height };
  }

  public getBounds(object: Container): { x: number, y: number, width: number, height: number } {
    return object.getBounds();
  }

  public getAlpha(object: Container): number {
    return object.alpha;
  }

  public getZIndex(object: Container): number {
    return object.zIndex;
  }

  public setZIndex(object: Container, index: number) {
    object.zIndex = index;
  }

  public setAlpha(object: Container, alpha: number) {
    object.alpha = Number(alpha);
  }
}

export default ObjectHandler;