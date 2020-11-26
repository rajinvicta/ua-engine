class Point {
    protected _x: number;
    protected _y: number;
    private _onUpdate: Function;

    constructor() {
        this._onUpdate = () => {};
    }

    init(x: number, y: number){
        this._x = x; this._y = y;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
        this._onUpdate();
    }

    set x(x: number) {
        this._x = x;
        this._onUpdate();
    }

    set onUpdate(update: Function) {
        this._onUpdate = update;
    }

    public createNew(x: number, y: number): Point {
        let point = new Point();
        point.init(x, y);
        return point;
    }
}

export default Point;