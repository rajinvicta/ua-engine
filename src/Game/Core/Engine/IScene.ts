
interface IScene {
  init(scriptName?: string): void;
  preload(): void;
  start(): void;

  shutdown(): void;
}

export default IScene;