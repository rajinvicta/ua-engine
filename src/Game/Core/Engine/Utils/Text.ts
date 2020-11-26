import * as _ from 'lodash';

class Text {

    private constructor() { }

    /**
      * @description concatenate an array of strings, with a seperator substring. For no seperator, use ""
      * @param array the array of strings to combine
      * @param seperator the seperator substring to insert between entries, like underscore. For no seperator, use ""
      */

    public concat(array: string[], seperator: string): string {
        let result: string = array[0];
        for (let x = 1; x < array.length; x++) {
            result = result + seperator + array[x];
        }
        //    console.log(result);

        return result;
    }

    public getUniq(vals: string[]): string[]{
        let uVals = _.uniq(vals);
        return uVals;
    }

    /**
     * @description break a string into a string array, based on the provided seperator substring, and remove falsy values
     * @param text the string to break into a string array
     * @param seperator the seperator substring
     */
    public unstringifyArray(txt: string, seperator: string): string[] {
        return _.compact(txt.replace(' ', '').split(seperator));
    }

    public propertiesFromString(rawText: string, lineSeperator: string, valueAssigner: string, valueSeperator: string): object {
        let obj: any = {};
        let lines: string[] = rawText.trim().split(lineSeperator);
        for (let x = 0; x < lines.length; x++) {
            let sublines : string[] = lines[x].split(valueAssigner);

            if (sublines.length < 2) console.error("error in assigning key value in line: %s", lines[x]);

            let vals = sublines[1].trim().split(valueSeperator);
            if (vals.length <= 1) {
                obj[sublines[0]] = vals[0]
            }
            else {
                obj[sublines[0]] = vals;
            }
        }

        return obj;
    }

    public split(text: string, seperator: string) : string[] {
        return _.split(text, seperator);
    }

}

export default Text;