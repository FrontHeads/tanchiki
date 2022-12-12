type Fn = (...args: Array<any>) => void;

export class EventEmitter {
  listeners: Record<string, Array<Fn>> = {};

  /** Подписка на событие.
   * Принимает название события и функцию-обработчик, которая будет вызвана при наступлении события. */
  on(eventName: string, callback: Fn) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  /** Оповещение о событии.
   * Принимает название события (+ опционально доп. данные) и оповещает подписчиков.
   * Т.е. запускает функции-обработчики прикрепленные к данному названию события через on() */
  emit(eventName: string, ...args: Array<unknown>) {
    this.listeners[eventName]?.forEach((listener: Fn) => {
      listener.apply(this, args);
    });
  }

  /** Отписка от события конкретной функции-обработчика.
   * Принимает название события и функцию-обработчик */
  off(eventName: string, callback: Fn) {
    this.listeners[eventName] = this.listeners[eventName]?.filter((listener: Fn) => listener !== callback);
  }

  /** Отписка всех функций-обработчиков от конкретного события. */
  offAll(eventName: string) {
    delete this.listeners[eventName];
  }
}
