import GameConfig from './GameConfig';
import ContainerObject from './GameObjects/ContainerObject';
import Events from './Events';

class ScaleManager {
  private _gameConfig: GameConfig;

  private _width: number;
  private _height: number;

  constructor(gameConfig: GameConfig) {
    this._gameConfig = gameConfig;

    this._width = 0;
    this._height = 0;
  }

  public init() {

    this._width = this._gameWidth();
    this._height = this._gameHeight();
    //console.log("smanager w(%s) h(%s)", this._width, this._height);
  }

  /**
   * @description rescales for window resize events, adapting to both width and height changes while maintaining aspect ratio
   * @param x width 
   * @param y 
   */
  public getWidthHeight(x: number, y: number): { x: number, y: number } {
    let scale = this._scaleFactor();
    let xPos = x, yPos = y;
    if (x !== 0) xPos = (x * scale);

    if (y !== 0) yPos = (y * scale);
    return { x: xPos, y: yPos };
  }

  public getScale(currentScale: number): number {
    let scale = this._scaleFactor() * currentScale;

    return scale;
  }

  public createNew(): ScaleManager {
    return new ScaleManager(this._gameConfig);
  }

  public scaleFactor(): number {
    return this._scaleFactor();
  }

  /**
   * @description returns the current scaleFactor. This value will change based on window resize events etc
   */
  private _scaleFactor(): number {
    let width = window.innerWidth;
    let height = window.innerHeight;

    let hRatio = (height / this._height);
    let wRatio = (width / this._width);

    return hRatio < wRatio ? hRatio : wRatio;
    // devicePixelRatio
  }

  private _gameWidth(): number {
    return this._gameConfig.data.DISPLAY.WIDTH;
  }

  private _gameHeight(): number {
    return this._gameConfig.data.DISPLAY.HEIGHT;
  }

}

export default ScaleManager;