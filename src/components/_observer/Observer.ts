/* eslint-disable fsd/hof-name-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Listeners, ListenersFunction, ListenersName } from 'components/type';

class Observer {
  constructor(public listeners: Listeners = {}) {}

  // dispatch, fire, trigger
  // Уведомляем слушателей если они есть
  emit(event: keyof typeof ListenersName, ...args: any): boolean {
    if (!Array.isArray(this.listeners[event])) {
      return false;
    }
    this.listeners[event]!.forEach((listener: ListenersFunction) => {
      listener(...args);
    });
    return true;
  }

  // on, listen
  // Подписываемся на уведомления
  // добавляем нового слушателя
  subscribe(
    event: keyof typeof ListenersName,
    fn: ListenersFunction
  ): ListenersFunction {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event]!.push(fn);
    return () => {
      this.listeners[event] = this.listeners[event]!.filter(
        (listener: ListenersFunction) => listener !== fn
      );
    };
  }
}

export default Observer;
