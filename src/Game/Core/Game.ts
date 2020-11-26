import World from './Engine/World';
import Events from './Engine/Events';
import ScaleManager from './Engine/ScaleManager';
import Expose from './Engine/Expose';
import Loop from './Engine/Loop';
import Loader from './Engine/Loader';
import GameConfig from './Engine/GameConfig';
import LevelManager from './Engine/LevelManager';
import IActivity from './Engine/IActivity';
import GOFactory from './Engine/GameObjects/GOFactory';
import Geom from './Geom/Geom';
import Utils from './Engine/Utils/Utils';
import IScene from './Engine/IScene';
import ILevel from './Engine/ILevel';
import Transitions from '../Core/Engine/Transitions';
import TweenManager from './Engine/TweenManager';

class Game {
  private _world: World; _events: Events;
  private _scaleManager: ScaleManager; _expose: Expose;

  private _loop: Loop; _loader: Loader; _gameConfig: GameConfig; _levelManager: LevelManager;
  private _goFactory: GOFactory; _geom: Geom; _utils: Utils;

  protected _activities: IActivity[];
  protected _currentActivity: IActivity;
  protected _gameStarted: boolean;
  protected _transitions = Transitions;
  protected _tween: TweenManager;

  constructor(world: World, loop: Loop, loader: Loader,
    events: Events, scaleManager: ScaleManager, expose: Expose, gameConfig: GameConfig,
    levelManager: LevelManager, goFactory: GOFactory, geom: Geom, utils: Utils, tween: TweenManager) {

    this._world = world;
    this._events = events;
  //  console.log("TARGET: ", events);
    this._scaleManager = scaleManager;
    this._expose = expose;

    this._loop = loop;
    this._loader = loader;
    this._gameConfig = gameConfig;
    this._levelManager = levelManager;
    this._goFactory = goFactory;

    this._geom = geom;
    this._utils = utils;
    this._tween = tween;

    this._activities = [];
    this._gameStarted = false;
    this._exposeGlobal();
  }

  /**
   * @description returns a list of all installed activity plugins
   */
  public get activities(): IActivity[] {
    return this._activities;
  }

 /*  public get transitions() {
    return this._transitions;
  } */

  /**
   * @description has the game already started (screen initialized on webpage)? 
   */
  public get gameStarted(): boolean {
    return this._gameStarted;
  }

  /**
     * @description finds and returns an activity type by its code
     * @param name find the activity type by this code
     */
  public get getActivityByName(): Function {
    return this._getActByName;
  }

  public get getActivityByCode(): Function {
    return this._getActByCode;
  }

  /**
   * @description adds an activity to the game/engine, as a plugin
   * @param act the activity type (object) to add.
   */
  public addActivity(act: IActivity) {
    this.activities.push(act);
  }

  /**
   * @description Removes an activity from the game/engine
   * @param act The activity type (object) to remove.
   */
  public removeActivity(act: IActivity): boolean {
    if(this.activities.indexOf(act) != -1){
      this.activities.splice(this.activities.indexOf(act), 1);
      return true;
    }
    console.warn('cannot remove an activity that has not been installed: ', act.name);
    return false;
  }

  /**
   * @description Starts the specified activity. Calls 'shutdown' event first.
   * @param act The activity type (object) to start. Takes the object itself, or it's name in the form of a string
   */
  public startActivity(act: IActivity | string, scriptName: any) {
    if (typeof act !== 'string') {
      this._startActivity(act, scriptName);
    }
    else {
      let name = act;
      let activity: IActivity | undefined;
      activity = this._getActByName(name);
      if (activity == undefined) {
        console.error('no activity found by name: ', name);
      }
      else {
        this._startActivity(activity, scriptName);
      }
    }
  }

  public loadLevel(level: ILevel, scriptName: string){
    this.loadScene(level, scriptName)
  }
  
  private _startActivity(act: IActivity, scriptName: string){
    // call shutdown, to give the current activity a chance to tidy up before the transition
   // setTimeout(()=>{debugger}, 1000); 
    // start the new activity, with the assumption that the shutdown has been handled
    act.startActivity(scriptName);
  }

  /**
   * @description say hi!
   */
  public sayHi() {
    console.log("Hi from UA-Engine");
  }

  /**
   * @description start the game. Calls game.init internally, to create the game screen.
   * @param configPath the path to the config.json file, which specified Display widht, height, file paths etc
   */
  public startGame(configPath: string) {
    return new Promise((resolve, reject) => {

      this._gameConfig.loadConfig(configPath).then((data: any) => {
        this._initScaleManager();

        this._world.init(this._gameConfig.data.DISPLAY.WIDTH, this._gameConfig.data.DISPLAY.HEIGHT);

        this._addListeners();
        this._onResize();
        this._gameStarted = true;
        resolve({ status: 'sucess' });

      });
    })
  }

  /**
   * @description load and start a level (via world.loadLevel). 
   * @param level the level to load
   */
  public loadScene(level: IScene, scriptName: string) {
    this._events.emit('shutdown');
    this._world.startScene(level, scriptName);
  }

  /**
   * @description returns the preset width of the game, as specified in config.json. Suitable for positioning objects relative 
   * to the screen.
   */
  public width() {
    return this._gameWidth();
  }

  /**
   * @description returns the preset height value of the game, as specified in config.json. Suitable for positioning objects relative
   * to the screen.
   */
  public height() {
    return this._gameHeight();
  }

  /**
   * @description finds and returns an activity type by its code
   * @param name find the activity type by this code
   */
  private _getActByName(name: string): IActivity | undefined {
    return this._getActByProperty('name', name);
  }

  /**
  * @description finds and returns an activity type by its name
  * @param code find the activity type by this name
  */
  private _getActByCode(code: string): IActivity | undefined {
    return this._getActByProperty('code', code);
  }

  private _getActByProperty(property: string, value: string): any | undefined {
    let acts: any[] = this._activities;
    for (let i = 0; i < this._activities.length; i++) {
      if (acts[i][property] == value) {
        return this._activities[i];
      }
    }

    console.warn('could not find an installed activity with %s: %s', property, value);
    return undefined;
  }

  private _onResize() {
    let target = this._scaleManager.getWidthHeight(this._gameWidth(), this._gameHeight());

    this._world.resize(target.x, target.y);
  }

  private _exposeGlobal() {
    this._expose.init();

    this._expose.add('game', this);
    this._expose.add('world', this._world);
    this._expose.add('loop', this._loop);
    this._expose.add('loader', this._loader);
    this._expose.add('events', this._events);
    this._expose.add('levelManager', this._levelManager);
    this._expose.add('gameConfig', this._gameConfig);
    this._expose.add('goFactory', this._goFactory);
    this._expose.add('geom', this._geom);
    this._expose.add('utils', this._utils);
    this._expose.add('transitions', this._transitions);
    this._expose.add('tween', this._tween);
  }

  private _addListeners(): void {
    this._events.addListener('resize', this._onResize, this);

    window.addEventListener('resize', () => {
      this._events.fire('resize');
    });
  }

  private _initScaleManager(): void {
    this._scaleManager.init();
  }

  private _gameWidth(): number {
    return this._gameConfig.data.DISPLAY.WIDTH;
  }

  private _gameHeight(): number {
    return this._gameConfig.data.DISPLAY.HEIGHT;
  }
}

export default Game;