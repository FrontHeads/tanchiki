type Fn = (...args: Array<any>) => void;

export class EventEmitter<T extends string = string> {
  listeners = {} as Record<T, Array<Fn>>;

  on(eventName: T, callback: Fn) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }
  emit(eventName: T, ...args: Array<unknown>) {
    this.listeners[eventName]?.forEach((listener: Fn) => {
      listener.apply(this, args);
    });
  }
  off(eventName: T, callback: Fn) {
    this.listeners[eventName] = this.listeners[eventName]?.filter((listener: Fn) => listener !== callback);
  }
  offAll(eventName: T) {
    delete this.listeners[eventName];
  }
}
