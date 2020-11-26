import FrameAnimationManager from './FrameAnimationManager';
import Events from '../../Events';
import ScaleManager from './ScaleHandler';
import IScreen from '../../../../Services/IScreen';
import ObjectHandler from '../../../../Services/ObjectHandler';
import InputHandler from './InputHandler';
import Utils from '../../Utils/Utils';
import MathUtils from '../../Utils/MathUtils';
import Point from '../../../Geom/Point';
import ResType from '../../../Data/ResType';
import IGameObject from '../IGameObject';
import ContainerObject from '../ContainerObject';
import Mask from '../Mask';
import SpineObject from '../SpineObject';
import Loop from '../../Loop';
import { RenderTexture } from 'pixi.js';


class ObjectCore {
  private _x: number;
  private _y: number;
  private _origin: Point; // should always be between 0 and 1.
  private _width: number;
  private _height: number;
  private _textureName: string;
  private _initialized: boolean;

  private _screen: IScreen; _objectHandler: ObjectHandler;
  private _input: InputHandler; _math: MathUtils;
  private _data: any;
  private _events: Events; _scaleHandler: ScaleManager; protected _pointFactory: Point; private _loop: Loop;

  private _go: IGameObject;
  private _atlas: string | null;
  private _mask: Mask;
  private _updateCallback: Function;

  constructor(screen: IScreen, objectHandler: ObjectHandler, input: InputHandler, mask: Mask, math: MathUtils, events: Events, pointFactory: Point, loop: Loop) {
    this._screen = screen;
    this._objectHandler = objectHandler;
    this._input = input;
    this._math = math;
    this._events = events;
    this._pointFactory = pointFactory;
    this._loop = loop;
    this._x = 0;
    this._y = 0;
    this._origin = this._pointFactory.createNew(0, 0);
    this._width = 0;
    this._height = 0;
    this._textureName = '';
    this._atlas = null;
    this._mask = mask;
    this._initialized = false;
  }

  // keep this one for GENERIC initializations 
  public init(go: IGameObject, x: number, y: number, textureName: string = '', updateCallback: Function) {
    this._go = go;
    this._scaleHandler = go.scaleHandler;
    this.x = x;
    this.y = y;
    this._textureName = textureName;
    this._initialized = true;
    this._updateCallback = updateCallback;

    if (this._go instanceof SpineObject == false) {

    }
    this._importSize();
    this._updateSize();
    this._setListners();
    this._loop.addFunction(this.update, this);
    this._events.on('shutdown', this._go.destroy, this._go);
  }

  get objectHandler() {
    return this._objectHandler;
  }

  get initialized() {
    return this._initialized;
  }

  get screen() {
    return this._screen;
  }

  get textureName() {
    return this._textureName;
  }

  set textureName(name: string) {
    this._textureName = name;
  }

  set x(xVal: number) {
    this._x = Number(xVal);
    this.objectHandler.setX(this._data, this._x);
    // this._updateXY();
    // this.updateOrigin();
  }

  set y(yVal: number) {
    this._y = Number(yVal);
    this.objectHandler.setY(this._data, this.y);
    //  this._updateXY();
    //  this.updateOrigin();
  }

  set width(width: number) {
    this._width = width;

    this._updateSize();
    this.updateOrigin();
  }

  set height(height: number) {
    this._height = height;

    this._updateSize();
    this.updateOrigin();
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get events() {
    return this._events;
  }

  set origin(origin: Point) {
    this._origin.x = origin.x;
    this._origin.y = origin.y;
    this.updateOrigin();
    // this._objectHandler.setXy(this._data, this._x, this._y);
  }

  get origin() {
    return this._origin;
  }

  setSize(width: number, height: number) {
    this._width = width;
    this._height = height;
    this._updateSize();
    this._updateXY();
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get alpha(): number {
    return this._objectHandler.getAlpha(this._data);
  }

  set alpha(alpha: number) {
    this._objectHandler.setAlpha(this._data, alpha);
  }

  get visible(): boolean {
    return this.data.visible;
  }

  set visible(visible: boolean) {
    this.data.visible = visible;
  }

  get input(): InputHandler {
    return this._input;
  }

  get atlas() {
    return this._atlas;
  }

  set atlas(atlas: any) {
    this._atlas = atlas;
  }

  get pixelPerfect(): boolean {
    return this._input.pixelPerfect;
  }

  get angle(): number {
    return this._data.angle;
  }

  set angle(angle: number) {
    this.objectHandler.setAngle(this.data, angle);
  }

  get left(): number{
    return this.x - (this.width * this.origin.x);
  }

  get right(): number {
    return this.left + this.width;
  }

  get top(): number {
    return this.y - (this.height * this.origin.y)
  }

  get bottom(): number {
    return this.top + this.height;
  }
  /**
   * @description look at (angle towards) an object on screen. Any object with an x and y parameter is acceptible
   * @param object the object (must have x and y properties) to angle towards 
   */
  public lookAt(object: { x: number, y: number }) {
  //  console.log('lookAt: ', object);
    let angle  = this._math.angleBetween(this, object);
    this.angle = angle;
  }

  public enableMask(x: number, y: number, width: number, height: number) {
    this._mask.init(x, y, width, height);

    this._objectHandler.setMask(this._data, this._mask.data);
  }

  public disableMask() {
    this._objectHandler.setMask(this._data, null);
  }

  // ONLY to be called by gameObject this component attaches to -- always listen for the destroy method on 
  // the gameObject itself.
  public destroy() {
    // remember to ALWAYS remove event listeners when destroying a GameObject
    this._loop.removeFunction(this.update, this);

    this._go.scaleHandler.shutdown.bind(this._go.scaleHandler)();
    this._events.off('shutdown', this._go.destroy, this._go);
    this._objectHandler.destroy(this._data);
  }

  /**
   * @description returns the bounds of the object in game units
   */
  public getGameUnitBounds(): { x: number, y: number, width: number, height: number } {
    let pxBounds = this._objectHandler.getBounds(this.data);
    let bounds = pxBounds;
    bounds.x /= this._scaleHandler.scaleFactor;
    bounds.y /= this._scaleHandler.scaleFactor;
    bounds.width /= this._scaleHandler.scaleFactor;
    bounds.height /= this._scaleHandler.scaleFactor;
    return bounds;
  }

  get data(): any {
    return this._data;
  }

  set data(data: any) {
    this._data = data;
  }

  get zIndex(){
    return this.objectHandler.getZIndex(this._data);
  }

  set zIndex(index: number){
    this.objectHandler.setZIndex(this._data, index);
  }

  public sort(property: string = 'bottom', desc: boolean = false){
    this._go.pcHandler.sort(property, desc);
  }

  public relativeMove(xDiff: number, yDiff: number) {
    let scaleX = this._scaleHandler.getScale(this._go.scaleHandler.scaleX);
    let scaleY = this._scaleHandler.getScale(this._go.scaleHandler.scaleY);

    console.log(scaleX);
    console.log(scaleY);

    this.x += xDiff;
    this.y += yDiff;
  }

  public moveToMouse(mouseEvt: any) {
    let scaleX = this._scaleHandler.getScale(this._go.scaleHandler.scaleX);
    let scaleY = this._scaleHandler.getScale(this._go.scaleHandler.scaleY);

    let c = document.getElementsByTagName('canvas')[0];
    let rect = c.getBoundingClientRect();

    let xPos = ((mouseEvt.clientX) / scaleX);
    let yPos = ((mouseEvt.clientY) / scaleY);

    this.x = xPos - (xPos * 0.13);
    if (yPos > 300) {
      this.y = yPos - (yPos * 0.16);
    }
  }

  public moveBy(x: number, y: number) {
    let xVal = this.x + x;
    let yVal = this.y + y;
    this.x = xVal;
    this.y = yVal;
  }

  public moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public setOrigin(x: number, y?: number) {
    // console.log('setOrigin this: ', this);
    let yVal: number;
    let xVal = x;
    if (y !== undefined) {
      yVal = y;
    }
    else {
      yVal = xVal;
    }

    this.origin = this._pointFactory.createNew(xVal, yVal);
  }

  updateOrigin() {
    // let scaleX = this._scaleHandler.getScale(this._scaleHandler.scaleX);
    //  let scaleY = this._scaleHandler.getScale(this._scaleHandler.scaleY);

    let p = this._pointFactory.createNew(this._origin.x * this._scaleHandler.scaleX, this._origin.y * this._scaleHandler.scaleY);
    this._objectHandler.setPivot(this._data, p);
  }

  public enableInput() {
    this._input.enableInput();
  }

  public createNew(): ObjectCore {
    //  let am = this._animationManager.createNew();
    //  console.log('new am: ', am);
    return new ObjectCore(this._screen, this._objectHandler, this._input.createNew(), this._mask.createNew(), this._math, this._events, this._pointFactory, this._loop);
  }

  public changeTexture(texture: string | any) {
    if (this._atlas != null) {
      this._screen.changeTexture(this._data, this._atlas, texture);
    } else {
      this._screen.changeTexture(this._data, texture);
    }
  }

  // ALWAYS listen for this update, because it calls the gameObjects update. 
  public update(time: number) {
    // console.log('update called in ObjectCore');
    if (this._updateCallback !== undefined && this._updateCallback !== null) {
      this._updateCallback.bind(this._go)(time);
    }
  }

  public updateXY() {
    this._updateXY();
  }

  public scaleMask() {
    if (this._mask.initialized) {
      let scaleX = this._scaleHandler.getScale(this._go.scaleHandler.scaleX);
      let scaleY = this._scaleHandler.getScale(this._go.scaleHandler.scaleY);

      this._mask.scale(scaleX, scaleY);
    }
  }

  private _updateXY() {
    let target = { x: this._x, y: this._y };
    /*  if(this._go.pcHandler.parent !== null && this._go.pcHandler.parent !== undefined){
 
       target = this._scaleHandler.getXY(this._x, this._y);
    } */
    this._objectHandler.setXy(this._data, target.x, target.y);
  }

  private _importSize() {
    this._width = this._objectHandler.getSize(this._data).width / this._scaleHandler.scaleX;
    this._height = this._objectHandler.getSize(this._data).height / this._scaleHandler.scaleY;
  }

  private _updateSize() {
    // let scaleX = this._scaleHandler.getScale(this._go.scaleHandler.scaleX);
    //  let scaleY = this._scaleHandler.getScale(this._go.scaleHandler.scaleY);

    this._objectHandler.setSize(this._data, this._width * this._go.scaleHandler.scaleX, this._height * this._go.scaleHandler.scaleY);
    //   this._objectHandler.setSize(this._data, this._width * scaleX, this._height * scaleY);
  }

  private _setListners() {
    this._origin.onUpdate = () => {
      this.updateOrigin();
      this.updateXY();
    }
  }


}

export default ObjectCore;