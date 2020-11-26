import MathUtils from "../Utils/MathUtils";

import ContainerObject from "./ContainerObject";
import Point from "../../Geom/Point";
import Geom from "../../Geom/Geom";
import GameConfig from "../GameConfig";
import InputManager from "../InputManager";
import TweenComponent from "./Components/TweenComponent";

class Camera {
    protected _math: MathUtils;
    protected _input: InputManager;
    protected _gameConfig: GameConfig;
    protected _geom: Geom;
    protected _container: ContainerObject;
    protected _initialized: boolean;
    protected _pivot: Point;
    protected _x: number;
    protected _y: number;
    private _tweenComponent: TweenComponent;
    //  protected _zoom: number;

    constructor(math: MathUtils, gameConfig: GameConfig, geom: Geom, input: InputManager, tweenComponent: TweenComponent) {
          this._math = math;
        this._gameConfig = gameConfig;
         this._geom = geom;
         this._input = input;
         this._tweenComponent = tweenComponent;
       /*  this._math = UAE.utils.math;
        this._gameConfig = UAE.gameConfig;
        this._input = UAE.levelManager.input;
        this._geom = UAE.geom; */
        this._pivot = this._geom.point(0, 0);
        this._x = 0;
        this._y = 0;
        //  this._zoom = 1;
        this._initialized = false;
        (<any>window).camera = this;
    }

    get tween(){
        return this._tweenComponent;
    }

    get initialized(): boolean {
        return this._initialized;
    }

    get x() {
        //   return this._container.x * -1;
        return this._x;
    }

    /**
     * @default set the x position of the camera. clamped so that you can't scroll out of the bounds of the defining container object
     */
    set x(x: number) {

        //  this._container.x = (x - ((this.width * this.pivot.x) / this.zoom)) * -1;
        this._x = x;
        this._updateContOrigin();
    }

    get y() {
        //  return this._container.y * -1;
        return this._y;
    }

    /**
   * @default set the y position of the camera. clamped so that you can't scroll out of the bounds of the defining container object
   */
    set y(y: number) {
        //  this._container.y = (y - ((this.height * this.pivot.y) / this.zoom)) * -1;
        this._y = y;
        this._updateContOrigin();
        //  this.pivot = this._pivot;
    }

    /**
  * @description get the left point of the camera, adjusted for zoon
  */
    get left(): number {
        //  return this.x;
        return this.x - (this.width * this.pivot.x); // width is already adjusted for zoom level, don't do it twice!
    }

    /**
     * @description get the leftmost point of the camera, unadjusted for zoon
     */
    get absoluteLeft(): number {
        //  return this.x;
        return this.x - (this.pivot.x * this.absoluteWidth);
    }

    /**
   * @description get the rightmost point of the camera, adjusted for zoon
   */
    get right(): number {
        //  return this.x + this._gameConfig.data.DISPLAY.WIDTH;
        // todo
        // possibly offset for zoom...
        return this.x + ((this.width * this.pivot.x)); // width is already adjusted for zoom level, don't do it twice!
    }

    /**
         * @description get the rightmost point of the camera, unadjusted for zoon
         */
    get absoluteRight(): number {
        //  return this.x + this._gameConfig.data.DISPLAY.WIDTH;
        // todo
        // possibly offset for zoom...
        return this.x + ((this.absoluteWidth * this.pivot.x));
    }


    get top(): number {
        // return this.y;
        return this.y - (this.pivot.y * this.height); // height is already adjusted for zoom, don't do it twice!
    }

    get absoluteTop(): number {
        // return this.y;
        return this.y - ((this.pivot.y * this.absoluteHeight));
    }

    get bottom(): number {
        // return this.y + this._gameConfig.data.DISPLAY.HEIGHT;
        // todo
        // possibly offset for zoom...
        return this.y + (this.pivot.y * this.height);
    }

    get absoluteBottom(): number {
        // return this.y;
        return this.y - ((this.pivot.y * this.absoluteHeight));
    }

    /**
     * @description move the camera, with the option of clamping movement within the bounds of the controlling ContainerObject (defaults to true)
     * @param x the x to move the camera to
     * @param y the y to move the camera to
     * @param clampToBounds enabled by default. Pass false to disable
     */
    move(x: number, y: number, clampToBounds: boolean = true) {
        if (!clampToBounds) {
            this.x = x;
            this.y = y;
            return;
        }

        let clampX = this._math.clamp(x, 0, this._container.width - this._gameConfig.data.DISPLAY.WIDTH);
        let clampY = this._math.clamp(y, 0, this._container.height - this._gameConfig.data.DISPLAY.HEIGHT);
        this.x = clampX;
        this.y = clampY;
    }

    /**
     * @description get the angle of the camera (attained relative to the angle of the paired container)
     */
    get angle() {
        let contAngle = this._container.angle;
        let angle = 360 - contAngle;
        return angle;
    }

    set angle(value: number) {
        let angle = value % 360;
        this._container.angle = 360 - angle;
    }


    /**
     * @description pivot point of camera
     */
    set pivot(pivot: { x: number, y: number }) {
       // console.log('set pivot...');
        this._pivot = this._pivot.createNew(this._math.clamp(pivot.x, 0, 1), this._math.clamp(pivot.y, 0, 1));
        this._updateContOrigin();
        //  this.x = this._x;
        //  this.y = this._y;
    }

    setPivot(x: number, y?: number) {
        if (y == undefined) y = x;
        this.pivot = { x: x, y: y }
        console.log('pivot: ', this.pivot);
    }

    get center(): { x: number, y: number } {
        return { x: this.centerX, y: this.centerY }
    }

    get centerX(): number {
        return this.left + (this.width / 2);
    }

    get centerY(): number {
        return this.top + (this.height / 2);
    }

    get pivotPoint(): { x: number, y: number } {
        return { x: this.x - (this.width * this.pivot.x), y: this.y - (this.height * this.pivot.y) }
    }

    _updateContOrigin() {
        console.log('camera.centerX: ', this.centerX, ' camera.centerY: ', this.centerY);
        let originX = ((this.pivotPoint.x / this._container.width));
        let originY = ((this.pivotPoint.y / this._container.height));
        console.log('origin x: ', originX, ', y: ', originY);
        this._container.setOrigin(originX, originY);
    }

    get pivot() {
        return this._pivot;
    }
    /**
     * @description set the zoom level of the camera. Sets the scaleX and scaleY of the container
     */
    set zoom(zoom: number) {
        let _clampZoom = this._math.clamp(zoom, 0, 10);
        this._container.scaleHandler.scaleX = _clampZoom;
        this._container.scaleHandler.scaleY = _clampZoom;
        this._updateContOrigin();
    }

    /**
     * @description the zoom level of the camera. Sets the scaleX and scaleY of the container
     */
    get zoom() {
        return this._container.scaleHandler.scaleX;
    }

    /**
     * @description returns the calculated 'bounds' of the camera, as an object, from left to right, top to bottom (adjusted for pivot)
     */
    get bounds(): { x: number, y: number, width: number, height: number } {
        return { x: this.left, y: this.top, width: this.width, height: this.height }
    }

    /**
     * @description the width of the camera, or 'viewport', adjusted for zoom level (scale of paired container)
     */
    get width(): number {
        // (experimental) factor in scale to compensate for zoom level...
        return this._gameConfig.data.DISPLAY.WIDTH / this.zoom;
    }

    /**
     * @description the height of the camera, or 'viewport', adjusted for zoom level (same as scale of paired container)
     */
    get height() {
        // (experimental) factor in scale to compensate for zoom level...
        return this._gameConfig.data.DISPLAY.HEIGHT / this.zoom;
    }

    /**
    * @description the absolute width of the camera, WITHOUT compensating for scale
    */
    get absoluteWidth(): number {
        return this._gameConfig.data.DISPLAY.WIDTH;
    }

    /**
     * @description the absolute height of the camera, WITHOUT compensating for scale
     */
    get absoluteHeight() {
        return this._gameConfig.data.DISPLAY.HEIGHT;
    }

    createNew(container: ContainerObject): Camera {
        let camera = this.createEmpty();
        camera.init(container);
        return camera;
    }

    //local version
   /*  createEmpty(): Camera {
        return new Camera();
    } */

    // engine version
     createEmpty(): Camera {
        return new Camera(this._math, this._gameConfig, this._geom, this._input, this._tweenComponent.createNew());
    } 

    init(container: ContainerObject) {
        this._container = container;
        this._initialized = true;
        this.setPivot(0.5);
        this._tweenComponent.init(this); // must init tweenComponent with a reference to the tweenable object
    }

    public addDebugControls(camera: Camera){
        let moveSpeed = 6;
        let inc = 0.1;
        this._input.onKeyDown(this._input.keys.A, function(){ camera.x -= moveSpeed}, this); // move left
        this._input.onKeyDown(this._input.keys.D, function(){ camera.x += moveSpeed}, this); // move right
        this._input.onKeyDown(this._input.keys.W, function(){ camera.y -= moveSpeed}, this); // move up
        this._input.onKeyDown(this._input.keys.S, function(){ camera.y += moveSpeed}, this); // move down
        this._input.onKeyDown(this._input.keys.Z, function(){ camera.angle -= moveSpeed}, this); // rotate anitclockwise
        this._input.onKeyDown(this._input.keys.X, function(){ camera.angle += moveSpeed}, this); // rotate clockwise
        this._input.onKeyDown(this._input.keys.Equals, function(){ camera.zoom += inc}, this);  // zoom in
        this._input.onKeyDown(this._input.keys.Dash, function(){ camera.zoom -= inc}, this); // zoom out
        this._input.onKeyDown(this._input.keys.UpArrow, function(){ camera.setPivot(camera.pivot.x + inc) }, this); // set pivot + 0.1
        this._input.onKeyDown(this._input.keys.DownArrow, function(){ camera.setPivot(camera.pivot.x - inc) }, this); // set pivot - 0.1
      }
    
}

export default Camera;