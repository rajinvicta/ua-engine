
class Events {
    private _events: any;
    private _timers: any;
    private _time: number;
    private _lastTime: number;
    private _delta: number;
    private _paused: boolean;
    private _timer: any; // ID of the timer (integer), passed to clearInterval for deletion
    private _step: number;

    constructor() {
        this._events = {};
        this._timers = [];
        this._paused = false;
        this._step = 25; // cannot execute every millisecond, browser isn't fast enough. 40 ticks per second should be adequate.
        this._time = new Date().getTime();
        this._lastTime = this._time - this._step;
        this._delta = this._time - this._lastTime;
        this._startTimer();

        this.addListener('pause', this.pause, this);
        this.addListener('resume', this.resume, this);

        //log events easily for testing
        (<any>window).events = this;
        // emit events easily for testing
        (<any>window).emit = this._trigger;
    }

    get events() {
        return this._events;
    }

    /**
     * @description returns an array of all timers
     */
    get timers() {
        return this._timers;
    }

    /**
     * @description is the timer system paused?
     */
    get paused(): boolean {
        return this._paused;
    }

    /**
     * @description returns a string array of the names of all registered events
     */
    public eventNames(): string[] {
        return this._eventNames();
    }

    /**
     * 
     * @param event adds an event to the array of registered events
     */
    public addEvent(event: string) {
        this._addEvent(event);
    }

    /**
     * 
     * @param event remove an event from the array of registered events
     */
    public removeEvent(event: string) {
        this._removeEvent(event);
    }

    /**
     * @description add a listener to an event. 
     * @param event name of the event. If it doesn't exist, it will be created.
     * @param callback the callback function to fire when the event emits.
     * @param context the context for the callback
     */
    public addListener(event: string, callback: Function, context: any) {
        this._addListener(event, callback, context);
    }

    /**
     * @description remove a listener (callback) from an event
     * @param event the event
     * @param callback the callback to remove
     */
    public removeListener(event: string, callback: Function, context: any) {
        this._removeListener(event, callback, context);

    }

    /**
     * @description add a listener to an event. 
     * @param event name of the event. If it doesn't exist, it will be created.
     * @param callback the callback function to fire when the event emits.
     * @param context the context for the callback
     */
    public on(event: string, callback: Function, context: any) {
        this._addListener(event, callback, context);
    }

    /**
    * @description add a listener to an event, to be called only one time, then removed from the list of callbacks.
    * @param event name of the event. If it doesn't exist, it will be created.
    * @param callback the callback function to fire when the event emits.
    * @param context the context for the callback
    */
    public once(event: string, callback: Function, context: any) {
        this._addListener(event, callback, context, true);
    }

    /**
    * @description remove a listener (callback) from an event
    * @param event the event
    * @param callback the callback to remove
    */
    public off(event: string, callback: Function, context: any) {
        this._removeListener(event, callback, context);
    }

    /**
     * @description emit an event
     * @param event the event to emit
     * @param data (optional) data object to pass to the callbacks for the event
     */
    public fire(event: string, data?: any) {
        this._trigger(event, data);
    }

    /**
    * @description emit an event
    * @param event the event to emit
    * @param data (optional) data object to pass to the callbacks for the event
    */
    public emit(event: string, data?: any) {
        this._trigger(event, data);
    }

    /**
    * @description emit an event
    * @param event the event to emit
    * @param data (optional) data object to pass to the callbacks for the event
    */
    public trigger(event: string, data?: any) {
        this._trigger(event, data);
    }

    /**
     * @description creates a timed callback, which is pausable via events.pause and events.resume. Optional repeat is 0 by default, 
     * meaning method executes once. Setting this to -1 will repeat continuosly.
     * @param callback the function to call after the delay has elapsed.
     * @param delay the amound of (unpaused) milliseconds to wait before execution. 
     * @param context the context to call it in
     * @param repeat should repeat? 0 for no. -1 for infinity, 3 for 3 repeats, 4 for 4 etc...
     */
    public timer(callback: Function, delay: number, context: any, repeat: number = 0): any {
        this._addTimer(callback, delay, context, repeat);
    }

    /**
     * @description find and remove a timer object based via the callback it contains
     * @param callback the callback of the timer object to be removed
     */
    public removeTimer(callback: Function) {
        let timer = this.getTimer(callback);
        this._removeTimer(timer);
    }

    private _eventNames(): string[] {
        return Object.keys(this._events);
    }

    private _trigger(event: string, data: any = null) {
       // console.log('triggering %s with data %s', event, data);
        if (this.eventNames().indexOf(event) !== -1) {
            let total = this._events[event].length - 1;
            if (total >= 0) {
                let objs = this.events[event];
                //console.log('callbacks for %s: ', event, objs);
                for (let x = total; x >= 0; x--) {
                    let obj = objs[x];

              //      console.log('about to attempt callback for %s with context: ', event, obj.context);

                    obj.callback.bind(obj.context)(data);
                    if (obj.once == true) { // if 'once' is set to true, remove callback
                        let i = this._events[event].indexOf(this.events[event][x]);
                        this._events[event].splice(i, 1);
                    }
                }
            }
            else {
                console.warn('event %s exists, but has no callbacks', event);
            }
        }
        else {
            console.warn('event %s does not exist, so cannot be triggered', event);
        }
    }

    private _addListener(event: string, callback: Function, context: any, once: boolean = false) {
        if (this.eventNames().indexOf(event) == -1) {
            this._events[event] = [];
        }

        this._events[event].push({ callback: callback, context: context, once: once });
    }

    private _removeListener(eventName: string, callback: Function, context: any) {
        //  console.log('requesting remove listener from %s: ', eventName, callback);
        //    debugger;
        if (this.eventNames().indexOf(eventName) !== -1) {
            let listener = this._findListener(eventName, callback, context);
            let event = this._events[eventName];
            //  console.log('event exists: ', event);
            // let index = event.indexOf(callback);
            if (listener) {
                //   console.log('found a match!! now REMOVING IT with splice..');
                event.splice(event.indexOf(listener), 1);
                return;
            }
            else {
                console.warn("cannot remove a listener for %s with context of %s that doesn't exist: %s", eventName, context, callback);
            }
        }
        else {
            console.warn('event %s does not exist, cannot remove callback', eventName);
        }
    }

    private _findListener(eventName: string, callback: Function, context: any): { callback: Function, context: any, once: boolean } | undefined {
        let event = this._events[eventName];
        //  console.log('looking for callback %s of event %s for object: ', callback, event, context);
        for (let x = 0; x < event.length; x++) {
            //   console.warn('checking if it matches: ', event[x]);
            if (event[x].callback == callback && event[x].context == context) {
                //   console.log('it matches!!');
                // debugger;
                return event[x];
            }
        }

        console.warn("cannot find a listener for %s with context of %s that looks like: %s", eventName, context, callback);
        console.log(`${eventName} listeners: `, event);
        // debugger;
    }

    private _removeEvent(event: string) {
        delete this._events[event];
    }

    private _removeTimer(timer: any) {
        if (timer !== null) {
            this._timers.splice(this._timers.indexOf(timer), 1);
        }
        else {
            console.warn('timer to remove is null: ', timer);
        }
    }

    public clearTimers() {
        this._timers = [];
    }

    /**
     * @description find the timer object from the _timers array which contains the specified callback mathod 
     * @param callback the callback of the timer object to be retrieved
     */
    public getTimer(callback: Function): any {
        for (let x = 0; x < this._timers.length; x++) {
            let timer = this._timers[x];
            if (timer.callback == callback) {
                return timer;
            }
        }

        console.warn('no timer found for: ', callback);
        return null;
    }

    /**
     * @description suspends the ticker for all timer objects
     */
    public pause() {
        this._paused = true;
        clearInterval(this._timer);
    }

    /**
     * @description resumes the ticker for all timer objects
     */
    public resume() {
        this._paused = false;
        this._startTimer();
    }

    private _addTimer(callback: Function, delay: number, context: any, repeat: number = 0): any {
        let timer = { delay: delay, remaining: delay, callback: callback, context: context, repeat: repeat }
        this._timers.push(timer);

        //  return timer;
    }

    private _addEvent(event: string) {
        if (this._eventNames().indexOf(event) == -1) {
            this._events[event] = [];
        }
        else {
            console.warn('event %s already exists, so cannot be added', event);
        }
    }

    private _ticker() {
        this._lastTime = this._time;
        this._time = new Date().getTime();
        this._delta = this._time - this._lastTime;
        this._updateTimers();
    }

    private _updateTimers() {

        for (let x = this._timers.length - 1; x >= 0; x--) {
            let timer = this._timers[x];
            timer.remaining -= this._delta;
            if (timer.remaining <= 0) {
                if (timer.repeat > 0 || timer.repeat === -1) {
                    timer.remaining = timer.delay;
                    if (timer.repeat > 0) {
                        timer.repeat--;
                    }
                }
                else {
                    this._removeTimer(this._timers.indexOf(timer));
                }
                timer.callback.bind(timer.context)();
            }

        }
    }

    private _startTimer() {
        // let _this = this;
        this._time = new Date().getTime();
        this._timer = setInterval(() => {
            this._ticker();
        }, this._step);
    }

}

export default Events;