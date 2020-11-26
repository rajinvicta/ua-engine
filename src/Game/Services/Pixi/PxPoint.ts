class PxPoint {
  private _x: number;
  private _y: number;
  private _onUpdateX: Function; _onUpdateY: Function;

  constructor() {
    this._x = 0;
    this._y = 0;

    this._onUpdateX = () => {};
    this._onUpdateY = () => {};
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  set x(xVal: number) {
    this._x = xVal;

    this._onUpdateX(xVal);
  }

  set y(yVal: number) {
    this._y = yVal;

    this._onUpdateY(yVal);
  }

  set onUpdateX(foo: Function) {
    this._onUpdateX = foo;
  }

  set onUpdateY(foo: Function) {
    this._onUpdateY = foo;
  }

  public createNew(x: number, y: number, onUpdateX: Function, onUpdateY: Function): PxPoint {
    let point =  new PxPoint();

    point.x = x;
    point.y = y;
    point.onUpdateX = onUpdateX;
    point.onUpdateY = onUpdateY;

    return point;
  }

  public setTo(x: number, y: number | null = null) {
    this._x = x;
    this._onUpdateX(x);

    if (y != null) {
      this._y = y;
      this._onUpdateY(y);
    }
  }
}

export default PxPoint;