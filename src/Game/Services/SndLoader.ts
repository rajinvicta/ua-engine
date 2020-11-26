import ISndLoader from './ISndLoader';
import HwLoader from './Howler/HwLoader';

class SndLoader implements ISndLoader {
    private _loader: HwLoader;
    private _baseURL: string;

    constructor(loader: HwLoader) {
        this._loader = loader;
        this._baseURL = '';
    }

    loadSounds(urls: string[], extensions: string[], onProgress: Function, onDone: Function, context: any): void {
        //  this._loader.loadSounds(urls, extensions, onProgress, onDone, context);
        for (let i = 0; i < urls.length; i++) {
            this.loadSound(urls[i], extensions, onProgress, onDone, context);
        }
    }

    loadSound(url: string, extensions: string[], onProgress: Function, onDone: Function, context: any) {
        let p = new Promise((resolve, reject) => {
            let result = this._loader.loadSound(url, extensions, onProgress, onDone, context);
            resolve(result);
        }).then((value: any) => {
            console.log(value, 'color:blue');
        }
        );
    }

    get baseURL(): string {
        return this._baseURL;
    }

}

export default SndLoader;