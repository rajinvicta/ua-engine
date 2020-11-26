import Anim from '../../../Data/Anim';
import Tween from '../../../Data/Tween';
import IGameObject from '../IGameObject';
import IFrameAnimatedGameObject from '../IFrameAnimatedGameObject';
import Loader from '../../Loader';
import ObjectCore from './ObjectCore';


class FrameAnimationManager implements IAnimationManager {
  private _go: IFrameAnimatedGameObject; private _anim: Anim; _activeAnimation: Anim | null; _tween: Tween;
  private _animations: Anim[]; private _loader: Loader;
  private _loopIndex: number; private _core: ObjectCore;

  constructor(anim: Anim, loader: Loader) {
    this._anim = anim;
    this._loader = loader;
    this._activeAnimation = null;
    this._loopIndex = 0;

    this._animations = [];

  }

  init(go: IFrameAnimatedGameObject, core: ObjectCore) {
    this._go = go; this._core = core;
  }

  get current() {
    return this._anim;
  }

  public play(name: string, loop: boolean = false) {
    let anim = this._getAnim(name);

    if (anim != null) {
     // console.log(`%c calling play on ${name}  for ${this._go.textureName}?`, 'color: purple;');
      this._play(anim);
    } else {
      console.error("Could not find animation named: %s", name);
    }
  }

  public pause(name: string) {
    let anim = this._getAnim(name);

    if (anim != null) {
      anim.pause();
    }
  }

  public resume(name: string) {
    let anim = this._getAnim(name);

    if (anim != null) {
      anim.resume();
    }
  }

  //max has to be dynamic
  //-1 for nothing, single frame

  public addAnimation(name: string, frames: string[], fps: number = 24) {
    let prevAnim = this._getAnim(name);
    let anim: Anim = this._anim.createNew();

    if (prevAnim == null) {
      anim.init(name, frames, fps);
      this._animations.push(anim);
    } else {
      console.warn(`Animation "${name}" already added to ${this._go.textureName}, not adding again!`);
    }
  }

  /**
   * @description a helper function to generate frames based on a max value etc
   * @param name 
   * @param base 
   * @param max 
   * @param fps 
   */
  public genFramesNumerically(name: string, base: string = '', max: number): string[] {
    let arr: string[] = [];

    for (let c = 0; c < max; c++) {
      arr.push(base + name + (c + 1).toString());
    }
    return arr;
  }

  public autoGenFrames(name: string): string[] {
   // console.log('trying to gen frames for %s on %s', name, this._go.textureName);
    let atlasName = this._core.atlas;
    let res = this._loader.getResource(atlasName, true);
    if (res !== null) {
      let json = res.data.data;
      // console.log('json: ', res);
      let frames = json.frames;
      let frameNames: string[] = [];

      for (let x = 0; x < frames.length; x++) {
        let fname: string = frames[x].filename;
        let reg = new RegExp(name + '[-_]' + '[0-9]|' + name + '[0-9]');

        if (fname == name) {
          frameNames.push(fname);
        }
        else if (fname.match(reg)) {
          frameNames.push(fname);
        }
      }
      //  console.log('frames: ', frameNames);
      return frameNames;
    }
    console.error('no resource in resList with name ', atlasName);
    return [];
  }

  public createNew(): FrameAnimationManager {
    return new FrameAnimationManager(this._anim.createNew(), this._loader);
  }

  public getUpdatedFrame(): string | null {
    if (this._loopIndex < 60) {
      this._loopIndex++;
    } else {
      this._loopIndex = 1;
    }

    if (this._activeAnimation != null) {
      let canUpdate = this._canUpdate(this._activeAnimation.fps, this._loopIndex);

      if (canUpdate) {
        return this._activeAnimation.getNextFrame();
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  public update() {
    if (!this._core.initialized) return;

    let updatedFrame = this.getUpdatedFrame();
    // monitor if update is called
   /*  if (this._core.atlas == 'continue_button') {
      console.log('AnimManager.update called for %s at %s', this._core.atlas, new Date().getTime());
    } */
    if (updatedFrame != null) {
      if (this._core.atlas != null) {
        this._core.screen.changeTexture(this._core.data, this._core.atlas, updatedFrame);
        // monitor if the texture is being updated
       /*  if (this._core.atlas == 'continue_button') {
          console.log('changeTexture called for', this._core.atlas);
        } */
      } else {
        this._core.screen.changeTexture(this._core.data, updatedFrame);
      }
    }
  }

  private _canUpdate(fps: number, loopIndex: number): boolean {
    let difference = 60 / fps;

    if (loopIndex % difference == 0) {
      return true;
    } else {
      return false;
    }
  }

  private _play(anim: Anim) {
  //  console.log('frames: ', anim.frames)
    this._activeAnimation = anim;
  }

  private _getAnim(name: string): Anim | null {
    for (let c = 0; c < this._animations.length; c++) {
      let anim = this._animations[c];
      if (anim.name == name) return anim;
    }

    return null;
  }
}

export default FrameAnimationManager;