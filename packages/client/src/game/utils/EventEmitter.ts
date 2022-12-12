type Fn = (...args: Array<any>) => void;

export class EventEmitter<T extends string = string> {
  listeners = {} as Record<T, Array<Fn>>;

  /** Подписка на событие.
   * Принимает название события и функцию-обработчик, которая будет вызвана при наступлении события. */
  on(eventName: T, callback: Fn) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
    return this;
  }

  /** Оповещение о событии.
   * Принимает название события (+ опционально доп. данные) и оповещает подписчиков.
   * Т.е. запускает функции-обработчики прикрепленные к данному названию события через on() */

  emit(eventName: T, ...args: Array<unknown>) {
    this.listeners[eventName]?.forEach((listener: Fn) => {
      listener.apply(this, args);
    });
  }

  /** Отписка от события конкретной функции-обработчика.
   * Принимает название события и функцию-обработчик */

  off(eventName: T, callback: Fn) {
    this.listeners[eventName] = this.listeners[eventName]?.filter((listener: Fn) => listener !== callback);
    return this;
  }

  /** Отписка всех функций-обработчиков от конкретного события. */

  offAll(eventName: T) {
    delete this.listeners[eventName];
    return this;
  }
}
