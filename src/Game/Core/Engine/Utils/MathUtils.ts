class MathUtils {
    private constructor() { }

    /**
     * @description get a range of numbers in an array, from lowest to highest
     * @param lowest the number to start the range on
     * @param finish the number to finish the range on
     */
    public getRangeArray(lowest: number, highest: number): number[] {
        let arr: number[] = [];

        for (let x = lowest; x <= highest; x++) {
            arr.push(x);
        }

        return arr;
    }

    /**
     * @description get the smallest number in an array
     * @param a the array of numbers to be assessed
     */
    public getSmallestNumber(a: Number[]) {
        var lowest = 0;
        for (var i = 1; i < a.length; i++) {
            if (a[i] < a[lowest]) lowest = i;
        }
        return lowest;
    }

    public clamp(val: number, min: number, max: number) {
        let result = val;
        if (result > max) {
            result = max;
        }
        else if (result < min) {
            result = min;
        }

        return result;
    }

    public round(val: number) {
        return Math.round(val);
    }

    /**
     * @description returns the highest value in an array of numbers
     * @param vals the array to evaluate
     */
    public max(vals: number[]): number {
        return vals.reduce((a, b) => {
            return Math.max(a, b);
        })
    }

    /**
     * @description return the lowest value in an array of numbers
     * @param vals the array to evaluate
     * 
     */
    public min(vals: number[]): number {
        return vals.reduce((a, b) => {
            return Math.min(a, b);
        })
    }


    /**
     * @description get the absolute difference between 2 numbers (adjusts for negative values with ternary operator)
     * @param a the first number
     * @param b the second number
     */
    public absoluteDiff(a: number, b: number): number {
        return (a > b) ? Math.abs(a - b) : Math.abs(b - a);
    }

    /**
   * @description get the difference between 2 numbers (adjusts for negative values with ternary operator)
   * @param a the first number
   * @param b the second number
   */
    public diff(a: number, b: number): number {
        return (a > b) ? (a - b) : (b - a);
    }

    /**
     * @description calculate the absolute distance between 2 points
     * @param x1 the x of point 1
     * @param y1 the y of point 1
     * @param x2 the x of point 2
     * @param y2 the y of point 2
     */
    public distanceBetween(x1: number, y1: number, x2: number, y2: number): number {
        let xDiff = x2 - x1;
        let yDiff = y2 - y1;
        let distance = Math.hypot(xDiff, yDiff);
        return distance;
    }

    /**
   * @description find the angle (in degrees) between two objects.
   * @param object the first object.
   * @param object2 the second object.
   */
    public angleBetween(object: { x: number, y: number }, object2: { x: number, y: number }): number {
        return this.angle(object.x, object.y, object2.x, object2.y);
    }

    /**
     * @description find the angle between 2 points
     * @param x1 the x of point 1
     * @param y1 the y of point 1
     * @param x2 the x of point 2
     * @param y2 the y of point 2
     */
    public angle(x1: number, y1: number, x2: number, y2: number) {
        let xDist = x2 - x1;
        let yDist = y2 - y1;
        let radians = this.radiansBetween(yDist, xDist);
        //console.log('radians: ', radians);
        let degrees = this.radiansToDegrees(radians);

        return degrees;
    }

    /**
    * @description find the angle in radians between two points, based on the y and x distances between them
    * @param yDist the distance on the y axis between the objects
    * @param xDist the distance on the x axis between the objects
    */
    public radiansBetween(yDist: number, xDist: number): number {
        return Math.atan2(yDist, xDist);
    }

    /**
     * @description convert radians to degrees
     * @param radians the radians to convert
     */
    public radiansToDegrees(radians: number): number {
        return radians * (180 / Math.PI);
    }

}

export default MathUtils;