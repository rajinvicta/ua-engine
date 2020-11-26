import Loader from './Loader';
import HwPlayer from '../../Services/Howler/HwPlayer';
import Events from './Events';

class AudioManager {

    private _loader: Loader; _hwPlayer: HwPlayer; _events: Events;
    private _playing: string[];
    private _instPlaying: string; // the ID of the instruction audio file currently playing
    private _instArr: string[]; // the array of instructional audio names currently being played through
    private _music: string; // the name of the current music file

    constructor(loader: Loader, hwLoader: HwPlayer, events: Events) {
        this._loader = loader;
        this._hwPlayer = hwLoader;
        this._playing = [];
        this._instPlaying = '';
        this._instArr = [];
        this._music = '';
        this._events = events;
        this._events.on('shutdown', this._stopInstPlaying, this);
    }

    get filesPlaying() {
        return this._playing;
    }

    /**
     * @description play the specified audio file
     * @param name the name of the file to play
     * @param onStop called when the file has stopped playing
     * @param loop should the file loop?
     */
    public play(name: string, onStop: Function, loop: boolean = false) {
        let _name = name;
        let res = this._loader.getResource(name, true);
        if (res !== null) {
            this._hwPlayer.play(name, res, () => {
                //   console.log('callback received for %s in AudioManager', _name)
                this._playing.splice(this._playing.indexOf(name), 1);
                onStop();
            }, loop);
        } else console.error("no resource named ", name);

    }

    /**
     * @description for playing instructional audio arrays, one after the other. Mostly used for playing contents of audio_id in scripts
     * @param arr the array of audio ids to play
     * @param onDone Called when the entire array has been played.
     */
    public playInstructionArr(arr: string[], onDone: Function) {
        this._stopInstPlaying(); // clean the palette
        this._instArr = arr; // new instructional array
        //   console.log('playInstructionalArr called..');
        //   debugger;
        this._playInstruction(0, onDone);
    }

    /**
     * @description Specifically for playing music, since there can only be one music file playing at a time.
     * @param name the name of the music file to play
     * @param onStop called when the file has stopped playing
     * @param loop should the file loop?
     */
    public playMusic(name: string, onStop: Function, loop: boolean = false) {
        // todo
        this._music = name;
        this.play(name, onStop, loop);
    }

    /**
     * @description stop music playback
     */
    public stopMusic() {
        this._stop(this._music);
    }

    /**
     * @description stop playback for specified file
     * @param name the name of the file to stop playback for
     */
    public stop(name: string) {
        this._stop(name);
    }

    public stopInstruction(){
        this._stopInstPlaying();
    }

    private _stop(name: string) {
        let res = this._loader.getSndResource(name);
        if (res !== null) {
            this._playing.splice(this._playing.indexOf(name), 1);
            this._hwPlayer.stop(res);
        }
    }

    private _pause() {
        for (let x = 0; x < this._playing.length; x++) {
            this._pauseFile(this._playing[x]);
        }
    }

    private _resume() {
        for (let x = 0; x < this._playing.length; x++) {
            this._resumeFile(this._playing[x]);
        }
    }

    private _pauseFile(name: string) {
        let res = this._loader.getSndResource(name, true);
        if (res !== null) this._hwPlayer.pause(res);
    }

    private _resumeFile(name: string) {
        let res = this._loader.getSndResource(name, true);
        if (res !== null) this._hwPlayer.resume(res);
    }

    private _playInstruction(i: number, onDone: Function) {
        let _i = i, _name = this._instArr[i];

        this._instPlaying = _name;
        this.play(_name, () => {
            _i++;
            //  console.log('playing %s, at position %s, time: %s', _name, _i, new Date().getMilliseconds());
            if (_i < this._instArr.length) {
                this._playInstruction(_i, onDone);

            } else {
                onDone();
            }
        });
    }

    private _stopInstPlaying() {
        this._instArr = [];
        let res = this._loader.getSndResource(this._instPlaying, true);
        if (res !== null) {
            this._hwPlayer.stop(res);
            this._instPlaying = '';
        }
    }
}

export default AudioManager;