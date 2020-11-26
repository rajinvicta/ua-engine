import * as _ from 'lodash';

class Collections {

    private constructor() { } // make it instantiatable

    // return object in array OR array-like object (Object.keys implementation) with properties of specified values
    public findArrElWithPropVal(array: any[], properties: string[], values: string | number[]): any {
        let row: any = null;
        if (Array.isArray(array)) {
            //  console.trace('isArray');
            elements: for (let x = 0; x < array.length; x++) {
                props: for (let y = 0; y < properties.length; y++) {
                    // console.trace(array[x][properties[y]] + ', ' + values[y]);

                    let compLeft = array[x][properties[y]];
                    let compRight = values[y];


                    if (Array.isArray(array[x][properties[y]])) {
                        let compLeft = array[x][properties[y]].join();
                    }

                    if (Array.isArray(values[y])) {
                        let compLeft = (<any>values[y]).join();
                    }

                    if (array[x][properties[y]] === values[y]) {
                        //   console.trace('matching pair at ' + y);
                        if (y == properties.length - 1) {
                            row = array[x];
                            break elements;
                        }
                    }
                    else {

                        break props;
                    }
                }
            }
        }
        else if (Object(array)){
            elements: for (let x = 0; x < Object.keys(array).length; x++) {
                for (let y = 0; y < properties.length; y++) {
    
                    if (array[x][properties[y]] == values[y]) {
                        //   console.trace('matching pair at ' + y);
                        if (y == properties.length - 1) {
                            //   console.trace('found FULL match!');
                            row = array[x];
                            break elements;
                        }
                    }
                }
            }
        }

        if (row == null) {
            console.warn('no match found for ' + properties.toString() + " & " + values.toString());
        }

        return row;
    }

  /*   public findObjElWithPropVal(array: any | object, properties: string[], values: any[]): any {
        let row: any = null;
        
        elements: for (let x = 0; x < Object.keys(array).length; x++) {
            for (let y = 0; y < properties.length; y++) {

                if (array[x][properties[y]] == values[y]) {
                    //   console.trace('matching pair at ' + y);
                    if (y == properties.length - 1) {
                        //   console.trace('found FULL match!');
                        row = array[x];
                        break elements;
                    }
                }
         
            }
        }

        if (row == null) {
            console.trace('no match found for ' + properties.toString() + " & " + values.toString());
        }

        return row;
    } */

    // return the number of rows that match the criteria
    public numElementsWithPropVal(array: any[], properties: string[], values: any[]): number {
        let count: number = 0;
        if (Array.isArray(array)) {
            elements: for (let x = 0; x < array.length; x++) {
                props: for (let y = 0; y < properties.length; y++) {
                    if (array[x][properties[y]] === values[y]) {
                        if (y == properties.length - 1) {
                            count++;
                        }
                    }
                    else {
                        break props;
                    }
                }
            }
        }
        else if (Object(array)) {
            elements: for (let x = 0; x < Object.keys(array).length; x++) {
                for (let y = 0; y < properties.length; y++) {

                    if (array[x][properties[y]] == values[y]) {
                        if (y == properties.length - 1) {
                            count++;
                        }
                    }
                }
            }
        } else {
            console.error('wrong type provided; array or object required');
        }
        return count;
    }

    public allElementsWithPropVal(array: any[], properties: string[], values: any[]): any[] {
        let all: any[] = [];
        if (Array.isArray(array)) {
            // console.log('isArray');
            elements: for (let x = 0; x < array.length; x++) {
                props: for (let y = 0; y < properties.length; y++) {
                    // console.log(array[x][properties[y]] + ', ' + values[y]);
                    if (array[x][properties[y]] === values[y]) {
                        if (y == properties.length - 1) {
                            all.push(array[x]);
                        }
                    }
                    else {
                        break props;
                    }
                }
            }
        }
        else if (Object(array)) {
            elements: for (let x = 0; x < Object.keys(array).length; x++) {
                for (let y = 0; y < properties.length; y++) {

                    if (array[x][properties[y]] == values[y]) {
                        if (y == properties.length - 1) {
                            all.push(array[x]);
                        }
                    }
                }
            }
        } else {
            console.error('wrong type provided; array or object required');
        }
        return all;
    }

    public getUniqValsFromArrays(rows: any, arrs: string[]): string[] {
        let all: string[] = [];
        for (let x = 0; x < arrs.length; x++) {
            if (_.has(rows[0], arrs[x])) {
                for (let y = 0; y < rows.length; y++) {
                    all = all.concat(rows[y][arrs[x]].trim().split(','));
                }
            }
            else {
                console.warn('no col with name ' + arrs[x]);
            }
        }

        all = _.uniq(all);
        all = _.compact(all);
        return all;
    }

    /**
     * @description shuffle and return an array
     * @param a array to be shuffled
     */
    public shuffle(a: any): any[] {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

}

export default Collections;