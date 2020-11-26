import IParentChild from "../IParentChild";
import IGameObject from '../IGameObject';
import ObjectCore from './ObjectCore';
import TextObject from "../TextObject";

class ParentChildHandler implements IParentChild{
    private _parent: IGameObject | null = null;
    _children: IGameObject[];
    private _core: ObjectCore;
    private _go: IGameObject;

    constructor() {

    }

    createNew() {
        return new ParentChildHandler();
    }

    get parent() {
        return this._parent;
    }

    get data(){
        return this._go.data;
    }

    set parent(parent: IGameObject | null) {
        this._parent = parent;
      //  this._go.scaleHandler.onResize();
    }

    get children() {
        return this._children;
    }

    get core() {
        return this._core;
    }

    init(go: IGameObject, core: ObjectCore, parent: IParentChild | null = null) {
        this._core = core;
        this._go = go;
        this._children = [];
        this._parent = null;

        if (parent !== null) {
            parent.addChild(this._go);
        }
    }

    addChild(object: IGameObject): boolean {
        if (!this.hasChild(object)) {
            this._children.push(object);
            object.parent = this._go;

            // added this condition because text objects hold their Px data 1 level deeper, due to custom PxText class
            let child;
            if (object.data.data) {
                child = object.data.data;
            }
            else {
                child = object.data;
            }

            this.core.data.addChild(child);
            this._go.setOrigin(this._go.origin.x, this._go.origin.y); // needed to manually update origin calculation
            return true;
        }
        console.warn('that is already a child of this object, and cannot be added again');
        return false;
    }

    removeChild(object: IGameObject): void {
        if (this.hasChild(object)) {
            if(object.data.data){
             //   console.log('removing child TextObject, deal with it appropriately...')
                this.core.data.removeChild(object.data.data);
            }
            else {
                this.core.data.removeChild(object.data);
            }
            object.parent = null;
            this._children.splice(this._children.indexOf(object), 1);
            return;
        }
        console.warn('could not remove, no such entity found in children array');
    }

    hasChild(object: IGameObject): boolean {
        if (this._children.indexOf(object) !== -1) {
            return true;
        }
        return false;
    }

    public setChildIndex(child: IGameObject, index: number){
        child.zIndex = index;
    }

    /**
     * @description swap the z index (draw order) of 2 children
     */
    public swapZ(child1: IGameObject, child2: IGameObject){
        if(this._children.indexOf(child1) == -1) console.error('child1 is not in the children array');
        if(this._children.indexOf(child2) == -1) console.error('child2 is not in the children array');
        let child1Index = child1.zIndex; let child2Index = child2.zIndex;
        child1.zIndex = child2Index; child2.zIndex = child1Index;
    }

    /**
     * @description sorts zOrder by 'bottom' value unless a different property is specified
     * @param property The property to sort by. defaults to 'bottom'. 
     * @param desc Sorted in ascending order by default. Set this to force descending order.
     */
    public sort(property: string = 'bottom', desc: boolean = false){
        let children = <any>this._children.slice(0); // slice(0) effectively clones the array

        if(desc){
            children.sort((a: any, b: any)=> (a[property] > b[property]) ? 1 : -1);
        }
        else {
            children.sort((a: any, b: any)=> (a[property] < b[property]) ? 1 : -1);
        }

        for(let c = 0; c < children.length; c++){
            let child = this._children[c];
            child.zIndex = c;
        }
    }

    
}

export default ParentChildHandler;