import IGameObject from "./IGameObject";

interface IAnimatedGameObject extends IGameObject {
    animations: IAnimationManager;
}

export default IAnimatedGameObject;