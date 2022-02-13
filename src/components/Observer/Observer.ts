import {
  Listeners,
  ListenersFunction,
  ListenersFunctionUnsub
} from 'components/type';

abstract class Observer<T extends Record<string, unknown>> {
  constructor(private listeners: Listeners<T> = {} as Listeners<T>) {}

  protected emit<K extends keyof T>(event: K, args: T[K]): boolean {
    if (!Array.isArray(this.listeners[event])) {
      return false;
    }
    this.listeners[event]!.forEach((listener: ListenersFunction<T>) => {
      listener(args);
    });
    return true;
  }

  // eslint-disable-next-line fsd/hof-name-prefix
  subscribe<K extends keyof T>(
    event: K,
    fn: ListenersFunction<T>
  ): ListenersFunctionUnsub {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event]!.push(fn);

    return () => {
      this.listeners[event] = this.listeners[event]!.filter(
        (listener: ListenersFunction<T>) => listener !== fn
      );
    };
  }
}

export default Observer;
