import * as TWEEN from '@tweenjs/tween.js';

class Tween {
  private _name: string; _easing: string; _object: any; _data: TWEEN.Tween | null;
  private _paused: boolean; _pausedTime: number; _time: number; _pauseDiff: number;
  private _onCompleteListeners: Function[];
  private _onUpdateListeners: Function[];
  private _onRepeatListeners: Function[];
  private _onStartListeners: Function[];

  constructor() {
    this._name = '';
    this._easing = '';
    this._object = null;
    this._data = null;
    this._paused = false;
    this._pausedTime = 0;
    this._time = 0;
    this._pauseDiff = 0;
    this._onCompleteListeners = [];
    this._onRepeatListeners = [];
    this._onStartListeners = [];
    this._onUpdateListeners = [];
  }

  get name(): string {
    return this._name;
  }

  get isPaused(): boolean {
    if (this._data) {
      return this._data.isPaused();
    }
    console.error('cannot return isPaused for uninitialized tween object');
    return false;
  }

  get onComplete() {
    return this._onComplete;
  }

  get onStart() {
    return this._onStart;
  }

  get onRepeat() {
    return this._onRepeat;
  }

  get onUpdate() {
    return this._onUpdate;
  }

  start(tweenName?: string): Tween {
    if (this._data) {
      this._data.start.bind(this._data)();
      return this;
    }
    console.error('cannot return start property for uninitialized tween object');
    return this;
  }

  stop(tweenName?: string): Tween {
    if (this._data) {
      this._data.stop.bind(this._data)();
      return this;
    }
    console.error('cannot return stop property for uninitialized tween object');
    return this;
  }

  end(tweenName?: string): Tween {
    if (this._data) {
      this._data.end.bind(this._data)();
      return this;
    }
    console.error('cannot return end property for uninitialized tween object');
    return this;
  }

  public chain(tween: Tween): Tween {
    if (this._data !== undefined && this._data !== null && tween._data !== null) {
      this._data.chain(tween._data);
      return this;
    }

    if (this._data == undefined) console.error('this._data is undefined');
    if (this._data == null) console.error('this._data is null');
    if (tween == null) console.error('tween._data of tween provided for chaining is null');
    return this;
  }

  private _onComplete(callback: Function): Tween {
    this._onCompleteListeners[1] = callback;
    return this;
  }

  private _onUpdate(callback: Function): Tween {
    this._onUpdateListeners[1] = callback;
    return this;
  }

  private _onStart(callback: Function): Tween {
    this._onStartListeners[0] = callback;
    return this;
  }

  private _onRepeat(callback: Function): Tween {
    this._onRepeatListeners[0] = callback;
    return this;
  }

  private _callOnComplete() {
    this._callAll(this._onCompleteListeners);
    return this;
  }

  private _callOnRepeat() {
    this._callAll(this._onRepeatListeners);
    return this;
  }

  private _callOnStart() {
    this._callAll(this._onStartListeners);
    return this;
  }

  private _callOnUpdate() {
    console.log('tween _callOnUpdate');
    this._callAll(this._onUpdateListeners);
  }

  private _callAll(callbacks: Function[]) {
    for (let x = 0; x < callbacks.length; x++) {
      callbacks[x]();
    }
  }

  init(name: string, easing: string, object: any, repeat: number = 0, delay: number = 0) {
    this._name = name;
    this._easing = easing;
    this._object = object;

    this._data = new TWEEN.Tween(this._object);
   // if (repeat !== 0) this._data.repeat(repeat);
    this._data.repeat(repeat);
   // if (delay !== 0) this._data.delay(delay);
    this._data.delay(delay);

    this._data.onComplete(() => { this._callOnComplete() });
    this._data.onRepeat(() => { this._callOnRepeat() });
    this._data.onStart(() => { this._callOnStart() });
    this._data.onUpdate(this._callOnUpdate.bind(this));

    if (this._easing.split('.').length != 2) console.error("invalid easing: %s", easing);
    this.reset();
  }

  remove(tweenName?: string) {
    if (this._data) {
      TWEEN.remove(this._data);
      this._data = null;
    }
  }

  to(toObject: any, time: number, updateFunction: Function = () => { }): Tween {
    this.freeze();
    console.log('tween.to...');
    if (this._data != null) {
      let easing = this._easing.split('.')[0];
      let inOut = this._easing.split('.')[1];
      console.log('easing: ', easing, inOut);
      this._paused = false;
      console.log('paused: ', this._data.isPaused());
      this._data.to(toObject, time)
        .easing((<any>TWEEN).Easing[easing][inOut]);

      this._onUpdateListeners[0] = updateFunction;
      this._onCompleteListeners[0] = () => { this.freeze() };

    } else {
      console.error("this._data is null");
    }
    return this;
  }

  createNew(): Tween {
    return new Tween();
  }

  update(time: number) {
    if (this._data != null) {
      if (!this._paused) {
        this._data.update(time - this._pauseDiff);
      }
    }

    this._time = time;
  }

  pause(tweenName?: string): Tween {
    if (this._data != null) {
      this._paused = true;
      this._data.pause();
      this._pausedTime = this._time;
    } else {
      console.warn("Tween doesn't exist to be paused!");
    }

    return this;
  }

  freeze(): Tween {
    if (this._data != null) {
      this._paused = true;
    }

    return this;
  }

  reset(): Tween {
    if (this._data != null) {
      this._paused = false;
    }

    return this;
  }

  resume(): Tween {
    if (this._data != null) {
      this._paused = false;
      this._data.resume();
      let diff = this._time - this._pausedTime;
      this._pauseDiff = this._pauseDiff + diff;
    } else {
      console.warn("Tween._data doesn't exist to be resumed!");
    }
    return this;
  }

}

export default Tween;