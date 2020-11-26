import { DisplayObject, Container } from "pixi.js";
import TweenManager from "./TweenManager";
import Tween from "../Data/Tween";
import GameConfig from "./GameConfig";
import transitions from "./Transitions";
import IScreen from "../../Services/IScreen";
import Events from "./Events";
import GOFactory from "./GameObjects/GOFactory";

class TransitionManager {
    private _tweens: TweenManager; private _screen: IScreen; private _events: Events; private _goFactory: GOFactory;
    private _gameConfig: GameConfig;
    private _duration: number | null;
    private _oldLevel: Container | null;
    private _newLevel: Container | null;
    private _easing: string | null;
    private _onComplete: Function | null;

    constructor(tweens: TweenManager, gameConfig: GameConfig, screen: IScreen, events: Events, goFactory: GOFactory){
        this._tweens = tweens, this._screen = screen, this._events = events; this._goFactory = goFactory;
        this._gameConfig = gameConfig;
        this._duration = 2000;
        this._init();
    }

    private _init(){
        this._oldLevel = null;
        this._newLevel = null;
        this._easing = null;
        this._onComplete = null;
        this._duration = null;
    }

    public transition(newLevel: Container, oldLevel: Container, transition: string = '', onComplete: Function, easing: string = 'Bounce.InOut', duration: number = 2000){
        this._oldLevel = oldLevel;
        this._newLevel = newLevel;
        this._easing = easing;
        this._onComplete = onComplete;
        this._duration = duration;

        switch(transition){
            case transitions.SLIDE.LEFT:
                this._slideLeft();
                break;
            case transitions.SLIDE.RIGHT:
                this._slideRight();
                break;
            case transitions.SLIDE.UP:
                this._slideUp();
                break;
            case transitions.SLIDE.DOWN:
                this._slideDown();
                break;
        }
    }

    private _slideLeft(){
        if(this._newLevel == null || this._oldLevel == null){
            this._error('null values provided');
            return;
        }
        let name = 'slideLeft', xDiff = this._gameConfig.data.DISPLAY.WIDTH;
        let newTo = {x: this._newLevel.x + xDiff}, oldTo = {x: this._oldLevel.x + xDiff};
        this._newLevel.x = this._oldLevel.x + xDiff;
        this._newLevel.y = this._oldLevel.y;
        this._transition(name, newTo, oldTo);
    }

    private _slideRight(){
        if(this._newLevel == null || this._oldLevel == null){
            this._error('null values provided');
            return;
        }
        let name = 'slideRight', xDiff = this._gameConfig.data.DISPLAY.WIDTH;
        let newTo = {x: this._newLevel.x - xDiff}, oldTo = {x: this._oldLevel.x - xDiff};
        this._newLevel.x = this._oldLevel.x - xDiff;
        this._newLevel.y = this._oldLevel.y;
        this._transition(name, newTo, oldTo);
    }
    
    private _slideUp(){
        if(this._newLevel == null || this._oldLevel == null){
            this._error('null values provided');
            return;
        }
        let name = 'slideUp', yDiff = this._gameConfig.data.DISPLAY.HEIGHT;
        let newTo = {y: this._newLevel.y - yDiff}, oldTo = {y: this._oldLevel.y - yDiff};
        this._newLevel.x = this._oldLevel.x;
        this._newLevel.y = this._oldLevel.y + yDiff;
        this._transition(name, newTo, oldTo);
    }
    
    private _slideDown(){
        if(this._newLevel == null || this._oldLevel == null){
            this._error('null values provided');
            return;
        }
        let name = 'slideDown', yDiff = this._gameConfig.data.DISPLAY.HEIGHT;
        let newTo = {y: this._newLevel.y + yDiff}, oldTo = {y: this._oldLevel.y + yDiff};
        this._newLevel.x = this._oldLevel.x;
        this._newLevel.y = this._oldLevel.y - yDiff;
        this._transition(name, newTo, oldTo);
    }

    private _transition(name: string, newTo: any, oldTo: any){
        if(this._easing == null || this._duration == null || this._onComplete == null || this._oldLevel == null){
            this._error('null values provided');
            return;
        }
        let oldLevelSprite = this._screen.createSprite(this._oldLevel.x, this._oldLevel.y, this._screen.toTexture(this._oldLevel), null);
      // let oldSprite = this._goFactory.spriteFromObject(this._oldLevel.x, this._oldLevel.y, this._oldLevel, this._oldLevel.parent);
        
        this._events.emit('shutdown');
        this._oldLevel = null;
        this._tweens.once(name + 1, this._easing, this._newLevel, newTo, this._duration).getTween(name + 1).onComplete(this._onComplete);
        this._tweens.once(name + 2, this._easing, oldLevelSprite, oldTo, this._duration).getTween(name + 2).onComplete(this._onComplete);
    }

    private _error(message: string){
        console.error(message);
    }
}

export default TransitionManager;