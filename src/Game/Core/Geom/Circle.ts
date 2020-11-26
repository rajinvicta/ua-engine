import Point from "./Point";


class Circle {
    protected _pointFactory: Point;
    protected _center: Point;
    protected _radius: number;

    constructor(pointFactory: Point){
        this._pointFactory = pointFactory;
    }

    init(x: number, y: number, r: number){
        this._center = this._pointFactory.createNew(x, y);
        this._radius = r;
    }

    set center(center: Point){
        this._center = center;
    }

    get center(): Point {
        return this._center;
    }

    set radius(radius: number){
        this._radius = radius;
    }

    get radius(): number {
        return this._radius;
    }

    createNew(x: number, y: number, r: number): Circle{
        let circle = new Circle(this._pointFactory);
        circle.init(x, y, r);
        return circle;
    }
}

export default Circle;