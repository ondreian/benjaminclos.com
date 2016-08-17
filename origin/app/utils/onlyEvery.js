export default function onlyEvery (wait, fn) {
  let running = false
  return function ratelimited (...args) {
    if (running) return
    running = setTimeout( ()=> {
      running = false
      return fn.apply(this, args)
    }, wait)
  }
}