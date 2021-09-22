class Observer {
  constructor(public listeners: Object = {}) {}

  // dispatch, fire, trigger
  // Уведомляем слушателей если они есть
  // table.emit('table:select', {a: 1})
  emit(event: string, ...args) {
    if (!Array.isArray(this.listeners[event])) {
      return false
    }
    this.listeners[event].forEach((listener: Function) => {
      listener(...args)
    })
    return true
  }

  // on, listen
  // Подписываемся на уведомления
  // добавляем нового слушателя
  // formula.subscribe('table:select', () => {})
  subscribe(event: string, fn: Function) {
    this.listeners[event] = this.listeners[event] || []
    this.listeners[event].push(fn)
    return () => {
      this.listeners[event] = this.listeners[event].filter(
        (listener: Function) => listener !== fn
      )
    }
  }
}

export default Observer
