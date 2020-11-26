import Point from "../../Geom/Point";


class Vectors {
    protected _pointFactory: Point;
    // generate a grid, or matrix, of phaser points based on horizontal and vertical data
    private constructor(pointFactory: Point){
        this._pointFactory = pointFactory;
    }

    public getPointGrid(hor: number[], vert: number[]): Array<Point> {
        let points: Array<Point> = [];
        for (let y = 0; y < vert.length; y++) {
            for (let x = 0; x < hor.length; x++) {
                points.push(this._pointFactory.createNew(x, y));
            }
        }

        return points;
    }
}

export default Vectors;