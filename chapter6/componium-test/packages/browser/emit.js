class EventEmitter {
  constructor() {
    this.callbacks = {};
  }

  on(event, cb) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(cb);
  }

  emit(event, ...stuff) {
    let cbs = this.callbacks[event];
    if (cbs) {
      cbs.forEach((cb) => cb(...stuff));
    }
  }
}

export default EventEmitter;
