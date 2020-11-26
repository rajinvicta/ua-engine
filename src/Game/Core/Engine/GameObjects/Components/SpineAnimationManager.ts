import IGameObject from "../IGameObject";
import SpineObject from "../SpineObject";
import ObjectCore from "./ObjectCore";

class SpineAnimationManager implements IAnimationManager{
    protected _go: SpineObject; protected _core: ObjectCore;

    constructor(){
        
    }

    update(){
        // do nothing for now
    }

    init(go: SpineObject, core: ObjectCore){
        this._go = go; this._core = core;
        this._go.events.on('pause', this.pause, this);
        this._go.events.on('resume', this.resume, this);
    }   

    createNew(){
        return new SpineAnimationManager();
    }

    play(animName: string, loop: boolean = false){
        this._go.data.state.setAnimation(0, animName, loop);
    }

    pause(){
        this._go.data.state.timeScale = 0;
    }

    resume(){
        this._go.data.state.timeScale = 1;
    }

    public addAnimation(animName: string, loop: boolean, delay: number = 0){
        this._go.data.state.addAnimation(0, animName, loop, delay);
    }

    // a helper method for playing a sequence of animations
    public playAnimations(animNames: string[], loop: boolean = false) {
        for(let x = 0; x < animNames.length; x++){
            this._go.data.state.addAnimation(0, animNames[x], loop, 0);
        }
    }
    
    public clearAnimations(){
        this._go.data.state.clearTrack(0);
    }

    public setToSetupPose(){
        this._go.data.skeleton.setToSetupPose();
    }

    destroy(){
        this._go.events.off('pause', this.pause, this);
        this._go.events.off('resume', this.resume, this);
    }



}

export default SpineAnimationManager;