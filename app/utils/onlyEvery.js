export default function onlyEvery (wait, fn) {
  let running = false
  return function ratelimited (...args) {
    if (running) return running
    running = setTimeout( ()=> {
      running = false  
    }, wait)
    return fn.apply(this, args)
  }
}