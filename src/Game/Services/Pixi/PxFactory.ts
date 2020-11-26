import { Application, Loader, Sprite, Renderer, Container, NineSlicePlane, Point, Texture, RenderTexture, DisplayObject} from 'pixi.js';
import * as PIXI from 'pixi.js';
import PxText from './PxText';

class PxFactory {
  private _pxText: PxText;

  constructor(pxText: PxText) {
    this._pxText = pxText;
    this._applyHacks();
  }

  public createGame(w: number, h: number, container: string, renderer: string = "null"): Application {
    return new Application({
      width: w,
      height: h
    });
  }
  public createSprite(texture: any): Sprite {

    return new Sprite(texture);
  }

  public createVideo(url: string): Sprite {
    return new Sprite(Texture.from(url));
  }

  public createNineSlice(texture: PIXI.Texture, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number): NineSlicePlane {
    return new NineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight);
  }

  public createText(text: string, renderer: Renderer, style: any = undefined): PxText {
    let pxt = this._pxText.createNew();
    pxt.init(text, renderer, style);

    return pxt;
  }

  public createLoader(): Loader {
    return new Loader();
  }


  private _applyHacks() {
    this._hitmapHack();
  }

  private _hitmapHack() {
    console.log('applying hitmap hack...');
    //  debugger;
    const tempPoint = new PIXI.Point();
    /* Sprite.prototype.containsPoint = function (point: Point) : boolean {
      console.log('containsPoint hack');
      return false;
    } */
    Sprite.prototype.containsPoint = function (point: Point): boolean {
      // console.log('in overridden containsPoint hack method...');
      //  debugger;
      this.worldTransform.applyInverse(point, tempPoint);

      const width = this.texture.orig.width;
      const height = this.texture.orig.height;
      const x1 = -width * this.anchor.x;
      let y1 = 0;

      let flag = false;

      if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
        y1 = -height * this.anchor.y;

        if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
          flag = true;
        }
      }

      if (!flag) {
        return false
      }
      // bitmap check

      const tex = this.texture;
      const baseTex = this.texture.baseTexture;
      const res = baseTex.resolution;
      // @ts-ignore
      if (!baseTex.hitmap) {
        return true;
      }


      // @ts-ignore
      const hitmap = baseTex.hitmap;
      // this does not account for rotation yet!!!
      let dx = Math.round((tempPoint.x - x1 + tex.frame.x) * res);
      let dy = Math.round((tempPoint.y - y1 + tex.frame.y) * res);
      let ind = (dx + dy * baseTex.realWidth);
      let ind1 = ind % 32;
      let ind2 = ind / 32 | 0;
      return (hitmap[ind2] & (1 << ind1)) !== 0;
    }
  }

  public createContainer(): Container {
    return new Container();
  }
}

export default PxFactory;