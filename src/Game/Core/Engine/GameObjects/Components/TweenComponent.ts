import TweenManager from "../../TweenManager";
import Tween from "../../../Data/Tween";

class TweenComponent {
    private _tweenManager: TweenManager;
    private _tween: Tween; private _go: any; private _initialized: boolean;

    constructor(tweenManager: TweenManager, tween: Tween){
        this._tweenManager = tweenManager; this._tween = tween; 
        this._initialized = false;
    }

    init(go: any){
        this._go = go;
        this._initialized = true; 
    }

    createNew() {
        return new TweenComponent(this._tweenManager, this._tween.createNew());
    }

    get Easing() {
        return this._tweenManager.Easing;
    }

    /**
     * @description add a tween to this GameObject
     * @param easing The easing Algorithm to use.
     * @param repeat 0 for no repeat. Infinity for infinite repeat.
     * @param delay in milliseconds. Defaults to 0.
     * @param tweenName the name of the tween (optional at component level). If not provided, make sure you store the returned tween in a variable
     */
    public add(easing: string, repeat: number = 0, delay: number = 0, tweenName?: string): Tween {  
        if(tweenName == undefined) tweenName = this._tweenManager.tempName();
        return this._tweenManager.add(easing, this._go, repeat, delay, tweenName);
    }

    /**
     * @description remove a tween
     * @param tween the tween to remove (name of the tween, or the actual object)
     */
    public remove(tween: string | Tween) {
       this._tweenManager.remove(tween);
    }

    /**
     * @description Play a tween (via the tweens name)
     * @param tweenName The name of the tween to play
     * @param toObject The toObject for the tween (values to tween to go hear)
     * @param duration The duration in milliseconds
     * @param updateFunction An optional update method to pause
     */
    public play(tweenName: string, toObject: any, duration: number, updateFunction: Function = () => { }): TweenManager {
       return this._tweenManager.play(tweenName, toObject, duration, updateFunction);
    }

    public getTween(name: string): Tween {
       return this._tweenManager.getTween(name);
    }

    /**
     * @description a method that creates a tween, plays it once, and deletes it all all-in-one
     * @param easing the type of easing to use
     * @param object the object to tween
     * @param toObject the object that specifies the tween values
     * @param duration duration of the tween
     * @param delay optional delay
     * @param updateFunction optional update function
     */
    public once(easing: string, object: any, toObject: any, duration: number, delay: number = 0, updateFunction?: Function): TweenManager {
      return this._tweenManager.once(easing, object, toObject, duration, delay, updateFunction)
    }

    public pause(tweenName: string | Tween): TweenManager {
        return this._tweenManager.pause(tweenName);
    }

    public resume(tweenName: string | Tween): TweenManager {
      return this._tweenManager.resume(tweenName);
    }
}

export default TweenComponent;