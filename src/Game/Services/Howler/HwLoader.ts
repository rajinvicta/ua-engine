import {Howler, Howl} from 'howler';
import HwFactory from './HwFactory';

class HwLoader {
    _factory: HwFactory;
    _howls: Howl[];
    // keep track of exactly what sound resources have been loaded
    _loadedSounds: string[];

    constructor(factory: HwFactory){
       this._factory = factory;
       this._howls = [];
       this._loadedSounds = [];
    }

    // depricated -- extracting core logic into SndLoader, since it is Core to engine. 
    /* loadSounds(urls: string[], extensions: string[], onProgress: Function, onDone: Function, context: any) {
    
        for(let i = 0; i < urls.length; i++){
            this.loadSound(urls[i], extensions, onProgress, onDone, context);
        }
    } */

    /**
     * @description has this sound asset URL already been loaded?
     * @param url the url to check
     */
    loaded(url: string): boolean{
        return this._loadedSounds.indexOf(url) == -1 ?  false : true;
    }

    loadSound(url: string, extensions: string[], onProgress: Function, onDone: Function, context: any){
    
         // let loadP = new Promise((resolve, reject) =>{
              if(!this.loaded(url)){
       
                  this._loadedSounds.push(url);
                  let howl = this._factory.createHowl(url, extensions, ()=>{
                    // howl created
                  });
                  if(howl !== null){
                      this._howls.push(howl);
                      onProgress.bind(context)({data: howl, url: url});
                      return `%c${url} loaded asycronously`;
                  }
              }
              else {
                return `skipping ${url}, already loaded`;
              }
        //  }).then((value: any)=>{
           //   console.log(value, 'color:blue');
        //  })
    
    }

  /*   public addOnLoad(onLoad: any) {
        this._loader.onLoad.add(onLoad);
    } */
}

export default HwLoader;