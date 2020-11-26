import Point from './Point';

class Polygon {
    protected _pointFactory: Point;
    private _center: Point;
    private _points: Point[];

    // points relative to center
    constructor(pointFactory: Point){
        this._pointFactory = pointFactory;
    }

    init(center: Point, points: Point[]){
        this._center = center;
        this._points = points;
    }

    get center(): Point {
        return this._center;
    }

    set center(center: Point) {
        this._center = center;
    }

    setCenter(x: number, y: number){
        this.center = this._pointFactory.createNew(x, y);
    }

    get points(): Point[]{
        return this._points;
    }

    set points(points: Point[]) {
        this._points = points;
    }

    createNew(center: Point, points: Point[]): Polygon{
        let poly = new Polygon(this._pointFactory);
        poly.init(center, points);
        return poly;
    }
}

export default Polygon;