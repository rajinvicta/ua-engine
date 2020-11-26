import Events from "../Events";  // don't remove this import - it's needed
import IGameObject from "./IGameObject";
import ObjectCore from "./Components/ObjectCore";
import IParentChild from "./IParentChild";
import ParentChildHandler from "./Components/ParentChildHandler";
import IScreen from "../../../Services/IScreen";
import InputHandler from "./Components/InputHandler";
import ScaleHandler from "./Components/ScaleHandler";
import Point from "../../Geom/Point";
import TweenComponent from "./Components/TweenComponent";

class TextObject implements IGameObject {
    private _screen: IScreen;
    private _core: ObjectCore;
    private _input: InputHandler;
    private _pcHandler: ParentChildHandler;
    private _scaleHandler: ScaleHandler;
    private _letters: string;
    private _tweenComponent: TweenComponent;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: IScreen, input: InputHandler,
        scaleHandler: ScaleHandler, tweenComponent: TweenComponent) {
        this._core = objectCore; this._pcHandler = pcHandler; this._screen = screen; this._input = input;
        this._scaleHandler = scaleHandler; this._tweenComponent = tweenComponent;
        this._letters = '$$$$____$$$$'; //default uninitialized string
    }

    public init(x: number, y: number, text: string, style: any = undefined, parent: IParentChild | null = null): void {
        this._letters = text;

        this.data = this._screen.createText(x, y, text, style);
        this._core.init(this, x, y, undefined, this._update);
        this._input.init(this, this._core);
        this._scaleHandler.init(this, this._core);
        this._pcHandler.init(this, this._core, parent);
        this._tweenComponent.init(this);
    }

    public _update(time: any) {
      //  this._TweenComponent.update(time);
    }

    public createNew(x: number, y: number, textureName: string, frame: string | null = null, parent: IParentChild | null): TextObject {
        let textObj = this.createEmpty();
        textObj.init(x, y, textureName, frame, parent);
        return textObj;
    }

    public createEmpty(): TextObject {
        let textObj = new TextObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this._scaleHandler.createNew(), this._tweenComponent.createNew());
        return textObj;
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

    get input(): InputHandler {
        return this._input;
    }

    get scaleHandler() {
        return this._scaleHandler;
    }

    get pcHandler() {
        return this._pcHandler;
    }

    set text(lett: string) {
        if (this._letters == '$$$$____$$$$') {
            console.error("this is not a text ObjectCore, can't change letters!");
        } else {
            this._letters = lett;
        }
    }

    setStyle(style: any) {
        this._core._objectHandler.setStyle(this._core.data, style);
    }

    setTextColor(color: string) {
        this._core._objectHandler.setTextColor(this._core.data, color);
    }

    get text(): string {
        if (this._letters == '$$$$____$$$$') {
            console.error("this is not a text ObjectCore, can't change letters!");
            return '';
        } else {
            return this._letters;
        }
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

    get zIndex() {
        return this._core.zIndex;
    }

    set zIndex(index: number) {
        this._core.zIndex = index;
    }

    set visible(visible: boolean) {
        this._core.visible = visible;
    }

    get setOrigin(): (x: number, y?: number) => void {
        return this._core.setOrigin.bind(this._core);
    }

    get origin(): Point {
        return this._core.origin;
    }

    get left(): number {
        return this._core.left;
    }

    get right(): number {
        return this._core.right;
    }

    get top(): number {
        return this._core.top;
    }

    get bottom(): number {
        return this._core.bottom;
    }

    get relativeMove(): (xDiff: number, yDiff: number) => void {
        return this._core.relativeMove.bind(this._core);
    }

    get enableMask(): (x: number, y: number, width: number, height: number) => void {
        return this._core.enableMask.bind(this._core);
    }

    get width() {
        return this._core.width;
    }

    set width(width: number) {
        this._core.width = width;
    }

    get height() {
        return this._core.height;
    }

    set height(height: number) {
        this._core.height = height;
    }

    public changeTexture(textureName: string) {
        this._core.changeTexture(textureName);
    }

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

export default TextObject;