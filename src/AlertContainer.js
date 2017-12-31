class AlertContainer {
  constructor (defaultOptions) {
    this.defaultOptions = defaultOptions
    this.listners = []
    this.alerts = []
  }

  show = (message = '', options = {}) => {
    const id = new Date().getTime()
    const alertOptions = {
      ...this.defaultOptions,
      ...options
    }

    const alert = {
      id,
      message,
      options: alertOptions
    }

    alert.close = () => this.remove(alert)

    if (alert.options.timeout) {
      setTimeout(() => {
        this.remove(alert)
      }, alert.options.timeout)
    }

    this.alerts.push(alert)
    this._broadcast()
  }

  remove = alert => {
    const lengthBeforeRemove = this.alerts.length
    this.alerts = this.alerts.filter(a => a.id !== alert.id)

    if (lengthBeforeRemove > this.alerts.length) {
      this._broadcast()
      alert.options.onClose && alert.options.onClose()
    }
  }

  success = (message = '', options = {}) => {
    options.type = 'success'
    this.show(message, options)
  }

  error = (message = '', options = {}) => {
    options.type = 'error'
    this.show(message, options)
  }

  info = (message = '', options = {}) => {
    options.type = 'info'
    this.show(message, options)
  }

  _getAlerts = () => this.alerts

  _broadcast = () => {
    this.listners.forEach(listener => listener(this.alerts))
  }

  _subscribe = listener => {
    this.listners.push(listener)
  }

  _unsubscribe = listener => {
    this.listners = this.listners.filter(item => item !== listener)
  }
}

export default AlertContainer