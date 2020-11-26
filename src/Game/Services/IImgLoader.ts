interface IImgLoader {
  loadImages(images: string[], onProgress: any, onDone: any, context: any): void;
  loadSpine(name: string, jsonUrl: string): void;

  getResources(foo: Function): void;
  getTexture(resource: any, frame: any): any;
  download(onDone?: Function): void;
}

export default IImgLoader;