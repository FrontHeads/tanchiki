type Fn = (...args: Array<any>) => void;

export class EventEmitter {
  listeners: Record<string, Array<Fn>> = {};

  on(eventName: string, callback: Fn) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }
  emit(eventName: string, ...args: Array<unknown>) {
    this.listeners[eventName]?.forEach((listener: Fn) => {
      listener.apply(this, args);
    });
  }
  off(eventName: string, callback: Fn) {
    this.listeners[eventName] = this.listeners[eventName]?.filter((listener: Fn) => listener !== callback);
  }
  offAll(eventName: string) {
    delete this.listeners[eventName];
  }
}
