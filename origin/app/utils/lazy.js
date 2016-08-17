import m       from "mithril"
import Promise from "bluebird"

export default function Lazy () {
  return Lazy
    .elements()
    .map(Lazy.fetch)
}

Lazy.elements = function elements () {
  return Lazy.class 
    | document.getElementsByClassName() 
    | [].slice.call()
    | Promise.resolve()
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

    lazy.onerror = reject

    lazy.src = ele.dataset.background
  })
 
}