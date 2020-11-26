import IImgLoader from './IImgLoader';

import PxLoader from './Pixi/PxLoader';

class ImgLoader implements IImgLoader {
  private _pxLoader: PxLoader;

  constructor(pxLoader: PxLoader) {
    this._pxLoader = pxLoader;
  }

  public loadImages(images: string[], onProgress: any, onDone: any, context: any): void {
    this._pxLoader.addOnLoad(onProgress.bind(context));
    this._pxLoader.addOnComplete(onDone.bind(context));
    this._pxLoader.addImages(images);
  }

  public loadSpine(name: string, jsonUrl: string): void {
    this._pxLoader.addSpine(name, jsonUrl);
  }

  public download(): void {
    this._pxLoader.download();
  }

  public getResources(foo: Function): void {
    this._pxLoader.getResources(foo);
  }

  public getTexture(resource: any, frame: any = null): any {
    return this._pxLoader.getTexture(resource, frame);
  }
}

export default ImgLoader;