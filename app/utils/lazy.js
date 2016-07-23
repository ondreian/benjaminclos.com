import m       from "mithril"
import Promise from "bluebird"

export default function Lazy (done) {
  return (ele, isInitialized, context) => {
    if (isInitialized) return

    return Promise
      .resolve([])
      .then(Lazy.elements)
      .map(Lazy.fetch)
      .then(done)
  }
}

Lazy.elements = function elements (list) {
  return Lazy.class 
    | document.getElementsByClassName() 
    | list.slice.call()
}

Lazy.class = "lazy"

Lazy.fetch = function fetch (ele) {

  if (!ele.dataset.background) throw new Error("no data-background attribute found")
  const lazy = new Image()
  return new Promise( (resolve, reject)=> {
    lazy.onload = () => {
      ele.style.backgroundImage = `url(${ele.dataset.background})`
      resolve(ele)
    }

    lazy.src = ele.dataset.background
  })
 
}