import Text from './Text';
import * as _ from 'lodash';
import Collections from './Collections';

class ActScripts {
    private _text: Text;
    private _collections: Collections;

    private constructor(text: Text, collections: Collections) {
        this._text = text;
        this._collections = collections;
    }

    /**
   * @description a function to generate an array of objects from a column with 'stringified' tabular data. Use this for activity scripts with cells in columns which contain
   * more than one property, all baked into one string, with a : delineated, one line per property
   * @param array the array to pull the column from -- intended for object arrays generated from CSV files (tabular)
   * @param column the name of the column to generate objects from in the array
   */
    public objectArrayifyColumn(array: any, column: string): any[] {
        let arr: any[] = [];
        for (let x = 0; x < array.length; x++) {
            let text = array[x][column];
            if (text != "") {
                arr.push(this.objectifyCell(text));
            }
            else {
                arr.push({});
            }
        }
        return arr;
    }

    /**
     * @description break a string into seperate filenames, generally for image and sound references
     * @param text the string value from the 'cell', to be parsed.
     */
    public getValsFromCell(text: string): string[] {
        //  console.log(text);
        return this._text.unstringifyArray(text, ',');
    }

    /**
     * @description returns all the unique values found in a column of the activity script, with comma delineated values 
     * such as 'fish,dog,horse' 
     * @param script the activityScript to pull the values from
     * @param column the name of the 'column' in the script, now a property belonging to all objects in the object array
     */
    public getUniqValsFromCol(script: any, column: string): string[] {
        let vals: any[] = [];
        for (let x = 0; x < script.length; x++) {
            vals = vals.concat(this.getValsFromCell(script[x][column]));
        }
        return this.getUniq(vals);
    }

    /**
     * @description returns all the unique values found in comma delineated lists in all of the columns specified in
     * the cols array
     * @param script the script to pull the vals from
     * @param cols the 'columns', or properties, to include in the search
     */
    public getUniqValsFromCols(script: any, cols: string[]): string[] {
        let vals: any[] = [];
        for (let x = 0; x < cols.length; x++) {
            vals = vals.concat(this.getUniqValsFromCol(script, cols[x]));
        }

        return this.getUniq(vals);
    }

    /**
     * @description a simple helper method that takes an array, and returns it with all duplicate values removed
     * @param vals the array of values to remove duplicated from
     */
    public getUniq(vals: string[]) {
        return this._text.getUniq(vals);
    }

    /**
     * @description generates an object with properties from a string, where each key-value pair is on a new line, colon assigns a value, and
     * comma seperates multiple values.
     * @param cellString the string that the cell was converted to from the Activity Script
     */
    public objectifyCell(cellString: string): object {
        return this._text.propertiesFromString(cellString, '\n', ':', ',');
    }

    /**
     * @description returns the first row to match the specified criteria, or null if none
     * @param colnames the column names to look for values in. Order must match vals array
     * @param vals the vals to search for in the colnames array. Order must match colnames array.
     */
    public rowByColsWithVals(rows: any[], colnames: string[], vals: string | number[]) {
        let result = this._collections.findArrElWithPropVal(rows, colnames, vals);
        return result;
    }

    /**
   * @description returns all rows which match the specified criteria, or null if none
   * @param colnames the column names to look for values in. Order must match vals array
   * @param vals the vals to search for in the colnames array. Order must match colnames array.
   */
    public rowsByColsWithVals(rows: any[], colnames: string[], vals: string[]) {
        let result = this._collections.allElementsWithPropVal(rows, colnames, vals);
        return result;
    }

    /**
     * @description returns a perfect, deep clone of a JSON serializable object -- suitable for cloning actScripts,
     * but not for anything with methods.
     * @param script 
     */
    public clone(script: any): any {
        return JSON.parse(JSON.stringify(script)); // create a pure clone of an object, array, or array of objects. 
    }

    public toLines(text: string): string[] {
        let result = text.split('\n');
        //    console.log(result);
        //  debugger;
        return result;
    }

    /*    public toChunks(text: string): any{
           let chuncks = this._text.split(text, ' ');
           let words = chuncks.map((val: string, index: number, arr: string[])=>{
               val = val.replace(/\W/g, '').trim();
           }, this);
           let result = [chuncks, words];
           return result;
           console.log(result);
       } */

    public words(text: string): string[] {
        return _.words(text);
    }


}

export default ActScripts;