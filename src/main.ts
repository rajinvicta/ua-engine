import Game from './Game/Core/Game';
//@ts-ignore
import ControlContainer from './Dep/ControlContainer';

let control = new ControlContainer();
let game: Game = control.getMain();

game.sayHi();