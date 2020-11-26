import axios from 'axios';

class AjaxLoader {

    constructor() {
    }

    loadFile(url: string, onDone?: Function) {
        axios.get(url).then((data) => {
            if(onDone !== undefined){
                onDone(data);
            }
        });
    }
  /*   public loadFiles(urls: string[], onProgress: any, onDone: any, context: any): void {
        let x = 0;
        this.loadFile(urls[x], this.goAgain.bind(this), context);
    }
    goAgain(index: number, length: number) {
        index++;
        if (x <= urls.length - 1) {
            this.loadFile(urls[x])
        }
    } */


    /* public download(): void {
        this._pxLoader.download();
    } */
}

export default AjaxLoader;