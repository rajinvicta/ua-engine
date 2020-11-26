import Point from "./Point";

class LineSegment {
    protected _pointFactory: Point;
    private _pnt1: Point;
    private _pnt2: Point;

    constructor(pointFactory: Point) {
       this._pointFactory = pointFactory;
    }

    init(pnt1: Point, pnt2: Point){
        this._pnt1 = pnt1;
        this._pnt2 = pnt2;
    }

    createNew(pnt1: Point, pnt2: Point): LineSegment{
        let line = new LineSegment(this._pointFactory);
        line.init(pnt1, pnt2);  
        return line; 
    }
}

export default LineSegment;