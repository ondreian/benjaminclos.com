import EventEmitter2 from "eventemitter2"

export default class Wrapper extends EventEmitter2 {
  static create (ele) {
    return new Wrapper(ele) 
  }

  static isOnable (key) {
    return key[0] === "o" && key[1] === "n"
  }

  static pair (key) {
    return [ key, key.slice(2, key.length) ]
  }

  constructor (ele) {
    super()
    Object
      .keys(ele)
      .filter(Wrapper.isOnable)
      .map(Wrapper.pair)
      .forEach( ([native, wrapped]) => {
        ele[native]   = evt => this.emit(wrapped, evt)
        this[wrapped] = (...args) => {
          args.shift(wrapped)
          this.on.apply(this, args)
          return false
        }
      })
  }
}

