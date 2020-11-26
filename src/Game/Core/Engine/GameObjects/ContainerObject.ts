import Events from "../Events"; // don't remove this import - it's needed
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import IScreen from "../../../Services/IScreen";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from './Components/ScaleHandler';
import Point from "../../Geom/Point";
import TweenComponent from "./Components/TweenComponent";

class ContainerObject implements IGameObject {
    private _screen: IScreen;
    private _core: ObjectCore;
    private _input: InputHandler;
    private _scaleHandler: ScaleHandler;
    private _pcHandler: ParentChildHandler;
    private _tweenComponent: TweenComponent;
    private _pointFactory: Point;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: IScreen, input: InputHandler,
        scaleHandler: ScaleHandler, tweenComponent: TweenComponent, point: Point) {
        this._core = objectCore; this._pcHandler = pcHandler; this._screen = screen; this._input = input;
        this._scaleHandler = scaleHandler; this._tweenComponent = tweenComponent; this._pointFactory = point;
    }

    public init(x: number, y: number, parent: IParentChild | null): void {
        this.data = this._screen.createContainer(x, y);
        this._core.init(this, x, y, undefined, this._update);
        this._input.init(this, this._core);
        this._scaleHandler.init(this, this._core);
        this._pcHandler.init(this, this._core, parent);
        this._tweenComponent.init(this);
    }

    // only to be called by ObjectCore
     private _update(time: any) {
      //  this._tweenComponent.update(time);
    } 

    public createNew(x: number, y: number, parent: IParentChild | null): ContainerObject {
        let cont = this.createEmpty();
        cont.init(x, y, parent);
        return cont;
    }

    public createEmpty(): ContainerObject {
        return new ContainerObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this.scaleHandler.createNew(), this._tweenComponent.createNew(), this._pointFactory);
    }

    public changeTexture(textureName: string) {
        this._core.changeTexture(textureName);
    }

    get angle() {
        return this._core.angle;
    }

    set angle(angle: number) {
        this._core.angle = angle;
    }

    get tweens() {
        return this._tweenComponent;
    }

    get input() {
        return this._input;
    }

    get scaleHandler() {
        return this._scaleHandler;
    }

    get pcHandler() {
        return this._pcHandler;
    }

    get data() {
        return this._core.data;
    }

    set data(data: any) {
        this._core.data = data;
    }

    get textureName() {
        return this._core.textureName;
    }

    /**
  * @description READ-ONLY.
  */
    get atlas() {
        return this._core.atlas;
    }

    get x() {
        return this._core.x;
    }

    set x(x: number) {
        this._core.x = x;
    }

    get alpha() {
        return this._core.alpha;
    }

    set alpha(alpha: number) {
        this._core.alpha = alpha;
    }

    /*  get core() {
         return this._core;
     } */

    get events() {
        return this._core.events;
    }

    get y() {
        return this._core.y;
    }

    set y(y: number) {
        this._core.y = y;
    }

    get visible() {
        return this._core.visible;
    }

    set visible(visible: boolean) {
        this._core.visible = visible;
    }

    get zIndex() {
        return this._core.zIndex;
    }

    set zIndex(index: number) {
        this._core.zIndex = index;
    }

    /**
     * @description set the origin for the container. This is modified version of the method for use with containers, which uses a custom setPivot implementation
     * @param x the x value
     * @param y the y value. If no y value is provided, the x value will be used for y as well.
     */
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

        this._core.origin = this._pointFactory.createNew(xVal, yVal);
        this._setPivot();
    }

    /**
     * @description slightly hacky custom setPivot method, because we can't use the built in height and width properties, which are always 0,
     * and thus useless
     */
    private _setPivot() {
        this._core.data.pivot.set(Math.floor(this.origin.x * this._width()), Math.floor(this.origin.y * this._height()));
    } 

    get origin(): Point {
        return this._core.origin;
    }

    get relativeMove(): (xDiff: number, yDiff: number) => void {
        return this._core.relativeMove.bind(this._core);
    }

    get enableMask(): (x: number, y: number, width: number, height: number) => void {
        return this._core.enableMask.bind(this._core);
    }

    get width() {
        return this._width();
    }

    set width(width: number) {
        this._core.width = width;
    }

    get height() {
        //return this._core.height;
        return this._height();
    }

    set height(height: number) {
        this._core.height = height;
    }

    /**
    * @description returns the calculated 'bounds' of the ContainerObject as an object, in game-units
    */
    get bounds(): { x: number, y: number, width: number, height: number } {
        return { x: this.left, y: this.top, width: this.width, height: this.height }
    }

    get left(): number {
        return this.x;
    }

    get right(): number {
        return this.x + this._width();
    }

    get top(): number {
        return this.y;
    }

    get bottom(): number {
        return this.y + this._height();
    }

    private _width(): number {
        let right = 0;
        let children = this.pcHandler.children;
        for (let c = 0; c < children.length; c++) {
            let child = children[c];
            if (child.right > right) right = child.right;
        }

        return right;
    }

    private _height(): number {
        let bottom = 0;
        let children = this.pcHandler.children;
        for (let c = 0; c < children.length; c++) {
            let child = children[c];
            if (child.bottom > bottom) bottom = child.bottom;
        }

        return bottom;
    }

    // parent/child proxy methods
    addChild(child: IGameObject): void {
        this._pcHandler.addChild(child);
    }

    removeChild(child: IGameObject): void {
        this._pcHandler.removeChild(child);
    }

    hasChild(child: IGameObject): boolean {
        return this._pcHandler.hasChild(child);
    }

    get parent() {
        return this._pcHandler.parent;
    }

    set parent(parent: IGameObject | null) {
        this._pcHandler.parent = parent;
    }

    get children() {
        return this._pcHandler.children;
    }

    /**
    * @description look at (angle towards) an object on screen. Any object with an x and y parameter is acceptible
    * @param object the object (must have x and y properties) to angle towards 
    */
    public lookAt(object: { x: number, y: number }) {
        this._core.lookAt(object);
    }

    destroy() {
        if (this._pcHandler.parent !== null) this._pcHandler.parent.removeChild(this);
        this._core.destroy();
    }
}

export default ContainerObject;