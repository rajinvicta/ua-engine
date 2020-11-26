import Circle from "./Circle";
import Point from "./Point";
import LineSegment from './LineSegment';
import Rect from "./Rect";
import Polygon from './Polygon';

class Geom {
    protected _circle: Circle;
    protected _lineSegment: LineSegment;
    protected _point: Point;
    protected _rect: Rect;
    protected _polygon: Polygon;

    constructor(circle: Circle, lineSegment: LineSegment, point: Point, rect: Rect, polygon: Polygon){
        this._circle = circle, this._lineSegment = lineSegment, this._point = point, this._rect = rect, this._polygon = polygon;
    }

    circle(x: number, y: number, r: number): Circle {
        return this._circle.createNew(x, y, r);
    }

    lineSegment(pnt1: Point, pnt2: Point): LineSegment {
        return this._lineSegment.createNew(pnt1, pnt2);
    }

    point(x: number, y: number): Point{
        return this._point.createNew(x, y);
    }

    rect(x: number, y:number, width:number, height: number): Rect {
        return this._rect.createNew(x, y, width, height)
    }

    polygon(center: Point, points: Point[]): Polygon{
        return this._polygon.createNew(center, points);
    }
}

export default Geom;