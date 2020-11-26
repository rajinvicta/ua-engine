import Point from './Point';

class Rect {
    protected _pointFactory: Point;

    _x: number;
    _y: number;
    _width: number;
    _height: number;

    constructor(pointFactory: Point){
        this._pointFactory = pointFactory;
    }

    init(x: number, y: number, width: number, height: number) {
        this._x = x; this._y = y; this._width = width; this._height = height;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    set x(x: number) {
        this._x = x;
    }

    set y(y: number) {
        this._y = y;
    }

    get width(): number {
        return this._width;
    }

    set width(width: number) {
        this._width = width;
    }

    get height(): number {
        return this._height;
    }

    set height(height: number) {
        this._height = height;
    }

    halfHeight(): number {
        return this.height / 2;
    }

    halfWidth(): number {
        return this.width / 2;
    }

    topLeft(): Point {
        return this._pointFactory.createNew(this.x, this.y);
    }

    topCenter() {
        return this._pointFactory.createNew(this.x + this.halfWidth(), this.y);
    }

    center() {
        return this._pointFactory.createNew(this.x + this.halfWidth(), this.y + this.halfHeight());
    }

    topRight(): Point {
        return this._pointFactory.createNew(this.x + this.width, this.y);
    }

    rightCenter(): Point {
        return this._pointFactory.createNew(this.x + this.width, this.y + this.halfHeight());
    }

    bottomRight(): Point {
        return this._pointFactory.createNew(this.x + this.width, this.y + this.height);
    }

    bottomCenter(): Point {
        return this._pointFactory.createNew(this.x + this.halfWidth(), this.y + this.height)
    }

    bottomLeft(): Point {
        return this._pointFactory.createNew(this.x, this.y + this.height);
    }

    leftCenter(): Point {
        return this._pointFactory.createNew(this.x, this.y + this.halfHeight());
    }

    createNew(x: number, y: number, width: number, height: number): Rect{
        let rect = new Rect(this._pointFactory);
        rect.init(x, y, width, height);
        return rect;
    }
}

export default Rect;