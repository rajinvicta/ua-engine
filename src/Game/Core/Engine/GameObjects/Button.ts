import SpriteObject from "./SpriteObject";
import IParentChild from "./IParentChild";




class Button {

    public sprite: SpriteObject;

    protected _onDownCallback: Function | null;
    protected _context: any;
    protected _onUpCallback: Function | null;
    protected animNames: any;

    constructor(sprite: SpriteObject) {
        this.sprite = sprite;
    }

    public init(x: number, y: number, atlas: string, frame: string, animNames: {up: string, down: string, over: string, out: string}, onDown: Function | null = null, context: any, onUp: Function | null = null, parent?: IParentChild) {
        this.sprite = this.sprite.createNew(x, y, atlas, frame);
        this.animNames = animNames;

        this._addAnimations();
        if (parent) {
            parent.addChild(this.sprite);
        }

        this._onDownCallback = onDown;
        this._context = context;
        this._onUpCallback = onUp;

        this.enableInput();
        this.addInputListener('pointerdown', this._onDown, this);
        this.addInputListener('pointerup', this._onUp, this);
        this.addInputListener('pointerover', this._onOver, this);
        this.addInputListener('pointerout', this._onOut, this);
        this.sprite.events.timer(()=>{
          
        }, 5000, this, -1);
        (<any> window)[atlas] = this;
    }

    get x(){
        return this.sprite.x;
    }

    get alpha(){
        return this.sprite.alpha;
    }

    set alpha(alpha: number){
        this.sprite.alpha = alpha;
    }

    set x(x: number){
        this.sprite.x = x;
    }

    get y(){
        return this.sprite.y;
    }

    set y(y: number){
        this.sprite.y = y;
    }

    get width(){
        return this.sprite.width;
    }

    get height(){
        return this.sprite.height;
    }

    get visible(){
        return this.sprite.visible;
    }

    set visible(visible: boolean){
        this.sprite.visible = visible;
    }

    addInputListener(event: string, callback: Function, context: any){
        this.sprite.input.addInputListener(event, callback, context);
    }

    private _addAnimations() {
        this.addAnimation(this.animNames.up);
        this.addAnimation(this.animNames.down);
        this.addAnimation(this.animNames.over);
        this.addAnimation(this.animNames.out);
    }

    public addAnimation(name: string) {
        this.sprite.animations.addAnimation(name, this.sprite.animations.autoGenFrames(name));
    }

    public createNew(x: number, y: number, atlas: string, frame: string, animNames: any, onDown: Function, context: any, onUp: Function | null = null, parent?: IParentChild): Button {
        let button = this.createEmpty();
        button.init(x, y, atlas, frame, animNames, onDown, context, onUp, parent);
        return button;
    }
    
    public createEmpty(){
        return new Button(this.sprite.createEmpty());
    }

    public enableInput() {
        this.sprite.input.enableInput();
    }

    public disableInput() {
        this.sprite.input.disableInput();
    }

    public hide(){
        this.alpha = 0;
        this.disableInput();
    }

    public show(){
        this.alpha = 1;
        this.enableInput();
    }

    setOrigin(x: number, y: number) {
        this.sprite.setOrigin(x, y);
    }

    playAnimation(name: string, loop: boolean = true) {
       // console.log(`%c play ${name}  for ${this.sprite.textureName}?`, 'color: orange;');
        this.sprite.animations.play(name, loop);
    }

    public destroy(){
        this.sprite.destroy();
    }

    private _onDown() {
        console.log('onDown called for: ', this);
        this.playAnimation(this.animNames.down);
        if(this._onDownCallback !== null){
            console.log('onDownCallback not null');
            this._onDownCallback.bind(this._context)();
        }
    }


    
    private _onUp() {
       // console.log('onUp called for: ', this);
        
        this.playAnimation(this.animNames.up);
        if(this._onUpCallback !== null){
          //  console.log('onUpCallback not null');
            this._onUpCallback.bind(this._context)();
        }
    }

    private _onOver() {
       // console.log('onOver called for: ', this);
        this.playAnimation(this.animNames.over);
    }

    private _onOut() {
      //  console.log('onOut called for: ', this);
        this.playAnimation(this.animNames.out);
    }
}

export default Button;