import { Application, Sprite, Renderer, Container, DisplayObject, NineSlicePlane, BaseTexture, Graphics, RenderTexture } from 'pixi.js';
import PxText from './PxText';
import PxFactory from './PxFactory';
import Loader from '../../Core/Engine/Loader';
import 'pixi-spine';
import Events from '../../Core/Engine/Events';
import GameConfig from '../../Core/Engine/GameConfig';

class PxGame {
  private _pxFactory: PxFactory; _loader: Loader; _events: Events;
  private _game: Application | null; private _levelCont: Container; private _lastLevelCont: Container;
  private _gameConfig: GameConfig;

  constructor(pxFactory: PxFactory, loader: Loader, events: Events, gameConfig: GameConfig) {
    this._pxFactory = pxFactory;
    this._loader = loader;
    this._events = events;
    this._game = null;
    this._gameConfig = gameConfig;
    //  Object.defineProperty(Resource, 'source', any);
  }

  get levelCont(){
    return this._levelCont;
  }

  public init(w: number, h: number, container: string) {
    let elm = document.getElementById(container);

    this._game = this._createGame(w, h, container);
    this._game.renderer.backgroundColor = 0xfafad2;
    

    if (elm != null) {
      elm.appendChild(this._game.view);
      //  this._game.view.addEventListener('mousemove', this._onMouseMove.bind(this));
      this._game.view.addEventListener('pointermove', this._onMouseMove.bind(this));
    } else {
      console.warn("No element by id: '%s', appending to the body.", container);
      document.body.appendChild(this._game.view);
    }

    (<any> window).pixiGame = this._game;

    
  }

  public newLevel(){
    if(this._game !== null){
      if(this.levelCont !== null && this.levelCont !== undefined){
        this._lastLevelCont = this.levelCont;
        this._lastLevelCont.destroy();
      }
      this._levelCont = this._pxFactory.createContainer();
      this._game.stage.addChild(this._levelCont);
      this.levelCont.x = 0; this.levelCont.y = 0;
    }
  }

  _onMouseMove(evt: any) {
    let canvas = document.getElementsByTagName('canvas')[0];
    let rect = canvas.getBoundingClientRect();
    let args: any = {}
    args.mouseX = evt.clientX - rect.left;
    args.mouseY = evt.clientY - rect.top;
    args.moveX = evt.movementX;
    args.moveY = evt.movementY;
    //console.warn(evt);
    this._events.fire('pointermove', args);

  }

  public resize(width: number, height: number) {
    if (this._game != null) {
      this._game.renderer.resize(width, height)
     // console.warn('width provided: ', width);
      let scale = (width / this._gameConfig.data.DISPLAY.WIDTH);
  //    console.warn('scale::: ', scale);
      this._game.stage.scale.set(scale);
    }

  }

  public addText(x: number, y: number, text: string, style: any = undefined): PxText {
    if (this._game != null) {
      let txt = this._pxFactory.createText(text, this._game.renderer, style);

      txt.x = x;
      txt.y = y;

      this._game.stage.addChild(txt.data);

      return txt;
    } else {
      console.error("Can't add text before starting game!");

      let t: any;

      return <PxText>t;
    }
  }

  public addGraphic(x: number, y: number, width: number, height: number): Graphics {
    let gfx = new Graphics();
    gfx.x = x;
    gfx.y = y;

    gfx.beginFill();
    gfx.drawRect(x, y, width, height);
    gfx.endFill();

    this._addChild(gfx);

    return gfx;
  }

  public addContainer(x: number, y: number): Container {
    let cont = this._createContainer();
    cont.x = x;
    cont.y = y;
    this._addChild(cont);
    return cont;
  }

  public addSprite(x: number, y: number, texture: string, frame: string | null): Sprite {
    //  let texture = this._loader.getTexture(sprName);
    let sprite;

    sprite = this._createSprite(x, y, texture, frame);

    sprite.x = x;
    sprite.y = y;

    this._addChild(sprite);

    // this._enableInputEvents(sprite);

    return sprite;
  }

  public addVideo(x: number, y: number, videoName: string): Sprite{
    let video = this._createVideo(x, y, videoName);

    this._addChild(video);
    return video;
  }

  public addNineSlice(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): NineSlicePlane {

    let slice = this._createNineSlice(textureName, leftWidth, topHeight, rightWidth, bottomHeight);
    slice.x = x;
    slice.y = y;
    console.warn('slice object: ', slice);

    this._addChild(slice);
    if(this._game){
      console.log(this._game.stage.children);
    }
    // debugger;
    return slice;
  }

  public debugScreen(){
    if(this._game){
      console.log(this._game.stage.children);
    }
  }

  private _addChild(child: DisplayObject) {
    if (this._game != null && this.levelCont !== null && this.levelCont !== undefined) {
      //this._game.stage.addChild(child);
      this.levelCont.addChild(child);
    } else {
      console.error("Can not add sprite before initializing the game!");
    }
  }

  public genHitmap(baseTex: any, threshold: number) {
    if (!baseTex.resource) {
      //renderTexture
      return false;
    }
    // resource = <ImageResource>baseTex.resource;

    const imgSource = baseTex.resource.source;
    console.log(imgSource);
    let canvas = null;
    if (!imgSource) {
      console.warn('no imgSource for resource: ', baseTex.resource)
      return false;
    }
    let context = null;
    if (imgSource.getContext) {
      canvas = imgSource;
      context = canvas.getContext('2d');
      console.log(context);
    }
    else if (imgSource instanceof Image) {
      canvas = document.createElement('canvas');
      canvas.width = imgSource.width;
      canvas.height = imgSource.height;
      context = canvas.getContext('2d');
      if (context) {
        context.drawImage(imgSource, 0, 0);
      }
    }
    else {
      //unknown source;
      return false;
    }

    const w = canvas.width, h = canvas.height;
    let imageData = context.getImageData(0, 0, w, h);

    console.warn('building hitmap from context.getImageData, which yields: ', imageData);
    let hitmap = baseTex.hitmap = new Uint32Array(Math.ceil(w * h / 32));
    for (let i = 0; i < w * h; i++) {
      let ind1 = i % 32;
      let ind2 = i / 32 | 0;
      if (imageData.data[i * 4 + 3] >= threshold) {
        hitmap[ind2] = hitmap[ind2] | (1 << ind1);
      }
    }
    console.log('hitmap is: ', hitmap);
    console.log('baseTex.hitmap is: ', baseTex.hitmap);
   // debugger;
    return true;
  }

  public enableInput(sprite: DisplayObject) {
    sprite.interactive = true;
  }

  public disableInput(sprite: DisplayObject) {
    sprite.interactive = false;
  }

  public removeListener(event: string, sprite: DisplayObject, callback: Function) {
    // sprite.removeAllListeners('mouseup');
    sprite.removeListener(event, callback);
  }

  public addListener(event: string, sprite: DisplayObject, callback: Function, context: any) {
    sprite.on(event, callback, context);
    //  sprite.on('touchend', callback, context);
  }

  public addSpine(name: string): PIXI.spine.Spine | null {
    let spineResource = this._loader.getResource(name, true);
    let sprite = null;

    if (spineResource != null) {
      sprite = new PIXI.spine.Spine(spineResource.data.spineData);
      this._addChild(sprite);
    } else {
      console.log('spine resource named "%s" not found', name);
    }


    return sprite;
  }

  public updateTexture(sprite: Sprite, texture: string | any, frame: string | null = null): void {
    if(typeof texture == 'string'){
      let tex = this._loader.getTexture(texture, frame);
      sprite.texture = tex;
      return;
    }
    // if texture is not a string, it must be a Texture object; assign directly
    sprite.texture = texture;
  }

  public toTexture(object: DisplayObject) : PIXI.RenderTexture | null {
   if (this._game !== null ) return this._game.renderer.generateTexture(object, PIXI.SCALE_MODES.LINEAR, 1); return null;
  }

  public clearScreen() {
    console.log('clearing screen (todo)');
  }

  public width(): number | null{
    if(this._game) return this._game.stage.width; return null;
  }

  public height(): number | null{
    if(this._game) return this._game.stage.height; return null;
  }

  private _createSprite(x: number, y: number, texture: string | any, frame: string | null = null) {
    let textureObj = texture;
    if(typeof texture == 'string'){textureObj = this._loader.getTexture(texture, frame);}
   
    let sprite = this._pxFactory.createSprite(textureObj);
    sprite.x = x;
    sprite.y = y;

    return sprite;
  }

  private _createVideo(x: number, y: number, videoName: string): Sprite{
    let vSprite = this._pxFactory.createVideo(this._gameConfig.data.PATHS.VIDEO + videoName);
    vSprite.x = x;
    vSprite.y = y;

    return vSprite;
  }

  private _createNineSlice(textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): NineSlicePlane {
    let texture = this._loader.getTexture(textureName);
    let slice = this._pxFactory.createNineSlice(texture, leftWidth, topHeight, rightWidth, bottomHeight);
    slice.width = texture.width;
    slice.height = texture.height;

    return slice;
  }

  //Foreign Elements
  private _createGame(w: number, h: number, container: string): Application {
    return this._pxFactory.createGame(w, h, container);
  }

  private _createContainer(): Container {
    return this._pxFactory.createContainer();
  }
}

export default PxGame;