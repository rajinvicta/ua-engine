import Loader from '../../Core/Engine/Loader';
import { Howl } from 'howler';
import Resource from '../../Core/Data/Resource';

class HwPlayer {
    private _loader: Loader;
    //   private _playing: string[];

    constructor(loader: Loader) {
        this._loader = loader;
        //    this._playing = [];
    }

    /*  get playing(){
         return this._playing;
     } */

    play(name: string, res: Resource, onStop: Function, loop: boolean = false) {
        let url = '';
        let howl = <Howl>res.data;
        url = res.url;

        if (howl !== null) {
            if (loop) {
                howl.loop(true);
            }
            else {
                howl.loop(false);
            }
            howl.play();

            howl.off('end');
            howl.on('end', () => {
                //   this._playing.splice(this._playing.indexOf(url, 1));
            //    console.log('%s finished playing', res.basename);
              //  debugger;
                onStop();
            });
        }
        else {
            console.log('howl was null');
        }
    }

    pause(res: Resource) {
        let howl = <Howl>res.data;
        howl.pause();
    }

    resume(res: Resource) {
        let howl = <Howl>res.data;
        howl.play();
    }

    stop(res: Resource) {
        let howl = <Howl>res.data;
        if (howl.playing()) {
            howl.stop();
        }
    }

    private _getHowlByName(name: string): Howl | null {
        let res = this._loader.getSndResource(name, true);
        if (res !== null) {
            return <Howl>res.data;
        }

        return null;
    }


}

export default HwPlayer;