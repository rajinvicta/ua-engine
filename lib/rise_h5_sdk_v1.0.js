/* eslint-disable */

/* ---EventEmitter start--- */
function EventEmitter() {
    this.listeners = {};
    this.maxListener = 50;
  }
  
  EventEmitter.prototype.on = function (event, cb) {
    var listeners = this.listeners;
    // debugger;
    if (listeners[event] && listeners[event].length >= this.maxListener) {
      throw console.error('The maximum number of listeners is %d, you have exceeded the limit', this.maxListener)
    }
    if (listeners[event] instanceof Array) {
      if (listeners[event].indexOf(cb) === -1) {
        listeners[event].push(cb);
      }
    } else {
      listeners[event] = [].concat(cb);
    }
  }
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;
  
  EventEmitter.prototype.emit = function (event) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    this.listeners[event].forEach(cb => {
      cb.apply(null, args);
    });
  }
  
  EventEmitter.prototype.listeners = function (event) {
    return this.listeners[event];
  }
  
  EventEmitter.prototype.setMaxListeners = function (num) {
    this.maxListener = num;
  }
  
  EventEmitter.prototype.removeListener = function (event, listener) {
    var listeners = this.listeners;
    var arr = listeners[event] || [];
    var i = arr.indexOf(listener);
    if (i >= 0) {
      listeners[event].splice(i, 1);
    }
  }
  
  EventEmitter.prototype.removeAllListener = function (event) {
    this.listeners[event] = [];
  }
  
  EventEmitter.prototype.once = function (event, listener) {
    var self = this;
    function fn() {
      var args = Array.prototype.slice.call(arguments);
      listener.apply(null, args);
      self.removeListener(event, fn);
    }
    this.on(event, fn)
  }
  /* ---EventEmitter end--- */
  
  function postToRise(data) {
    console.log('sdk data:', data);
    if (data && data.behavior) {
      window.parent.postMessage && window.parent.postMessage(data, '*');
    }
  }
  // Buffer data and send it regularly. New data during the interval will replace the unsent data
  var bufferMap = new Map();
  var fastTimerDelay = 100;
  
  var fastTimer = setInterval(() => {
    if (bufferMap.size > 0) {
      bufferMap.forEach((value, key) => {
        postToRise(value);
        bufferMap.delete(key);
      });
    }
  }, fastTimerDelay);
  
  window.callRiseIframe = function (data) {
    if (data.interval) {
      bufferMap.set(data.behavior, data);
    } else if (data.waitOn && data.waitOn.length > 0) {
      // Set the delay execution to be greater than the timing execution queue delay to realize the waiting queue completion
      setTimeout(() => {
        postToRise(data);
      }, fastTimerDelay + 1);
    }
    else {
      postToRise(data);
    }
  };
  
  window.riseObserver = new EventEmitter();
  // window.riseData = {
  //   target: '', // 
  //   behavior: '',
  //   event: '',
  //   content: null,
  //   interval: false,
  //   waitOn: []
  // };
  
  window.addEventListener('message', function (evt) {
    var data = evt.data;
    if (data && data.behavior) {
      riseObserver.emit(data.behavior, data);
    }
  });
  