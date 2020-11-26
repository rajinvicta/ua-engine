import IGameObject from "./IGameObject";
import IScreen from "../../../Services/IScreen";
import ObjectCore from "./Components/ObjectCore";
import InputHandler from "./Components/InputHandler";
import ParentChildHandler from "./Components/ParentChildHandler";
import ScaleHandler from "./Components/ScaleHandler";
import TweenManager from "../TweenManager";
import IParentChild from "./IParentChild";
import GameConfig from '../GameConfig';
import Events from '../Events'; // don't remove this import - it's needed
import Point from "../../Geom/Point";
import TweenComponent from "./Components/TweenComponent";

class VideoObject implements IGameObject {
    private _screen: IScreen;
    private _core: ObjectCore;
    private _input: InputHandler;
    private _pcHandler: ParentChildHandler;
    private _scaleHandler: ScaleHandler;
    private _tweenComponent: TweenComponent;
    private _gameConfig: GameConfig;
    private _vidElement: HTMLVideoElement;

    constructor(objectCore: ObjectCore, pcHandler: ParentChildHandler, screen: IScreen, input: InputHandler,
        scaleHandler: ScaleHandler, tweenComponent: TweenComponent, gameConfig: GameConfig) {
        this._core = objectCore; this._pcHandler = pcHandler; this._screen = screen; this._input = input;
        this._scaleHandler = scaleHandler; this._tweenComponent = tweenComponent; this._gameConfig = gameConfig;
    }

    public init(x: number, y: number, videoName: string, parent: IParentChild | null = null): void {
        this.data = this._screen.createVideo(x, y, videoName);

        this._core.init(this, x, y, videoName, this._update);
        this._input.init(this, this._core);
        this._scaleHandler.init(this, this._core);
        this._pcHandler.init(this, this._core, parent);
        this._tweenComponent.init(this);

        //@ts-ignore
        this._vidElement = this.data.texture.baseTexture.resource.source;
        this._vidElement.addEventListener('canplay', () => {
            //   console.log('new width: ', this._vidElement.videoWidth);
            //   console.log('new height: ', this._vidElement.videoHeight);
            this._core.width = this._vidElement.videoWidth;
            this._core.height = this._vidElement.videoHeight;
            this._vidElement.pause();
        });

        this._core.setOrigin(0.5);
        this.input.enableInput();
        this.input.addInputListener('pointerdown', this._togglePause, this);
    }

    private _togglePause() {
        if (this._vidElement.paused) {
            this._vidElement.play();
        }
        else {
            this._vidElement.pause();
        }
    }

    public createNew(x: number, y: number, videoName: string, parent: IParentChild | null = null): VideoObject {
        let sprite = this.createEmpty();
        sprite.init(x, y, videoName, parent);
        return sprite;
    }

    public createEmpty(): VideoObject {
        return new VideoObject(this._core.createNew(), this._pcHandler.createNew(), this._screen, this._input.createNew(), this._scaleHandler.createNew(), this._tweenComponent.createNew(), this._gameConfig);
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

    get input(): InputHandler {
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
     * @description READ ONLY.
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

    /*  get core() {
         return this._core;
     } */

    get events() {
        return this._core.events;
    }

    get setOrigin(): (x: number, y?: number) => void {
        return this._core.setOrigin.bind(this._core);
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

    get alpha() {
        return this._core.alpha;
    }

    set alpha(alpha: number) {
        this._core.alpha = alpha;
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
    
    set height(height: number) {
        this._core.height = height;
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

    destroy(): void {
        this.input.removeInputListener('pointerdown', this._togglePause);
        this._core.destroy();
    }

    private _update(time: number) {
      //  this._tweenComponent.update(time);
    } 

}

export default VideoObject;