import {Sprite} from 'pixi.js';

interface IScreen {
  addHitMap(object: Sprite, threshold: number): void;
  
  createScreen(width: number, height: number, elementId: string): void;

  createContainer(x: number, y: number): any;

  createText(x: number, y: number, text: string, style?: any): any;

  createSprite(x: number, y: number, texture: string | any, frame: string | null): any;
  createVideo(x: number, y: number, videoName: string): any;

  createNineSlice(x: number, y: number, name: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): any;

  createGraphics(x: number, y: number, width: number, height: number): any;

  clearScreen(): void;

  changeTexture(sprite: Sprite, texture: string | any, frame?: string | null): void;
  toTexture(object: PIXI.DisplayObject): any;
  createSpine(name: string): any;

  enableInput(sprite: any): void;
  disableInput(sprite: any): void;

  addListener(event: string, sprite: any, callback: Function, context: any): void;

  removeListener(event: string, sprite: any, callback: Function): void;
  resize(width: number, height: number): void;

  debugScreen(): void;
  width(): number | null;
  height(): number | null;
  newLevel(): void;
}

export default IScreen;