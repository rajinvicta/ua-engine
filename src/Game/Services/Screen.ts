import {Application, Sprite, DisplayObject, Texture, RenderTexture} from 'pixi.js';

import IScreen from '../Services/IScreen';
import PxGame from '../Services/Pixi/PxGame';

class Screen implements IScreen {
  private _pxGame: PxGame;

  constructor(pxGame: PxGame) {
    this._pxGame = pxGame;

    console.log("a screen has been createed!");
  }

  public createScreen(width: number, height: number, elementId: string): void {
    this._pxGame.init(width, height, elementId);
  }

  public createContainer(x: number, y: number): any {
    return this._pxGame.addContainer(x, y);
  }

  public createSprite(x: number, y: number, texture: string | any, frame: string | null): any {
    return this._pxGame.addSprite(x, y, texture, frame);
  }

  public createVideo(x: number, y: number, videoName: string){
    return this._pxGame.addVideo(x, y, videoName);
  }

  public createNineSlice(x: number, y: number, name: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): any {
    return this._pxGame.addNineSlice(x, y, name, leftWidth, topHeight, rightWidth, bottomHeight);
  }

  public createSpine(name: string): any {
    return this._pxGame.addSpine(name);
  }

  public createGraphics(x: number, y: number, width: number, height: number): any {
    return this._pxGame.addGraphic(x, y, width, height);
  }

  public enableInput(sprite: any) {
    this._pxGame.enableInput(sprite);
  }

  public disableInput(sprite: any) {
    this._pxGame.disableInput(sprite);
  }
  
  public addListener(event: string, sprite: any, callback: Function, context: any) {
    this._pxGame.addListener(event, sprite, callback, context);
  }

  public removeListener(event: string, sprite: any, callback: Function) {
    this._pxGame.removeListener(event, sprite, callback);
  }

  public addHitMap(obj: Sprite, threshold: number = 127){
    this._pxGame.genHitmap(obj.texture.baseTexture, threshold);
  }

  /* public removeDownListener(sprite: any) {
    this._pxGame.removeDownListeners(sprite);
  }

  public removeUpListener(sprite: any){
    this._pxGame.removeUpListeners;
  } */

  public createText(x: number, y: number, text: string, style: any = undefined): any {
    return this._pxGame.addText(x, y, text, style);
  }

  public changeTexture(sprite: Sprite, texture: string | any, frame: string | null = null): void {
    this._pxGame.updateTexture(sprite, texture, frame);
  }

  public clearScreen(): void {
    this._pxGame.clearScreen();
  }

  public resize(width: number, height: number): void {
    this._pxGame.resize(width, height);
  }

  public debugScreen(){
    this._pxGame.debugScreen();
  }

  public width(): number | null {
    return this._pxGame.width();
  }

  public toTexture(object: DisplayObject) : any | null {
    return this._pxGame.toTexture(object);
  }

  public height(): number | null {
    return this._pxGame.height();
  }

  public newLevel(){
    this._pxGame.newLevel();
  }
}

export default Screen;