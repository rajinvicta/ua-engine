import Events from '../Engine/Events';

class Anim {
  private _events: Events;

  private _name: string;
  private _base: string;
  private _max: number;
  private _fps: number;
  private _data: any;
  private _index: number;
  private _paused: boolean;
  private _isSpine: boolean;
  private _globalPaused: boolean;
  private _frames: string[];

  constructor(events: Events) {
    this._events = events;

    this._name = '';
    this._base = '';
    this._fps = 24;
    this._max = 0;
    this._data = null;
    this._index = 0;
    this._isSpine = false;
    this._paused = false;
    this._frames = [];

    this._globalPaused = false;
    this._addListeners();
  }

  get name(): string {
    return this._name;
  }

  get data(): any {
    return this._data;
  }

  get frames(): string[] {
    return this._frames;
  }

  get fps(): number {
    return this._fps;
  }

  public init(name: string, frames: string[], fps: number = 24) {
    this._name = name;
   // this._data = data;
    this._frames = frames; 
    this._fps = 24;
   // console.log(name + ' frames: ', frames);
  }

  public getNextFrame(): string {
    if (this._paused) return this._frames[this._index - 1];

    let frames = this._frames;
    let frm = frames[this._index];

    this._index++;

    if (this._index > (frames.length - 1)) this._index = 0;

    return frm;
  }

  public createNew(): Anim {
    return new Anim(this._events);
  }

  public startSpineAnimation() {
    this._isSpine = true;

    this._data.state.setAnimation(0, this._name, true);
    this._data.state.timeScale = this._fps;
  }

  public pause() {
    this._paused = true;
    
    if (this._isSpine) this._data.state.timeScale = 0;
  }

  public resume() {
    this._paused = false;

    if (this._isSpine) {
      if (!this._globalPaused) this._data.state.timeScale = this._fps;
    }
  }

  private _globalPause() {
    this._globalPaused = true;

    if (this._isSpine) this._data.state.timeScale = 0;
  }

  private _globalResume() {
    this._globalPaused = false;

    this.resume();
  }

  private _addListeners() {
    this._events.addListener('pauseAll', () => {
      if (this._isSpine) this._globalPause();
    }, this);

    this._events.addListener('resumeAll', () => {
      if (this._isSpine) this._globalResume();
    }, this);
  }
}

export default Anim;