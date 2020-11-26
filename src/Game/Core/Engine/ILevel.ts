import IScene from "./IScene";

interface ILevel extends IScene {
    onNewRow(): void;
    loadConfig(): void;
    _waitForFirstInput(): void;
}

export default ILevel;