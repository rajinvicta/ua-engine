import ActScripts from './ActScripts';
import Collections from './Collections';
import Mixins from './Mixins';
import Colors from './Colors';
import MathUtils from './MathUtils';
import Text from './Text';
import Vectors from './Vectors';

class Utils {
    private _scripts: ActScripts;
    private _collections: Collections;
    private _colors: Colors;
    private _mixins: Mixins;
    private _math: MathUtils;
    private _Text: Text;
    private _Vectors: Vectors;
    
    constructor(actScripts: ActScripts, collections: Collections, colors: Colors, mixins: Mixins, math: MathUtils, text: Text, vectors: Vectors){
        this._scripts = actScripts; 
        this._collections = collections;
        this._colors = colors;
        this._mixins = mixins;
        this._math = math;
        this._Text = text;
        this._Vectors = vectors;

    }

    get script(){
        return this._scripts;
    }

    get coll(){
        return this._collections;
    }

    get color(){
        return this._scripts;
    }

    get mixin(){
        return this._mixins;
    }

    get math(){
        return this._math;
    }

    get text() {
        return this._Text;
    }

    get vector() {
        return this._Vectors;
    }
}

export default Utils;