import Promise               from "bluebird"
import m                     from "mithril"

import images                from "images"
import {bulma, styles, raw}  from "utils/bulma"
import Lazy                  from "utils/lazy"
import Matrix                from "utils/Matrix"
import List                  from "utils/List"
import Coin                  from "utils/Coin"
import Euclidean             from "utils/Euclidean"
import Roll                  from "animations/Roll"
import social                from "config/social"
import {menu}                from "layouts/App"

function randomImage (images) {
  return `/images/` + images[ Math.floor( Math.random() * images.length ) ]
}

function double (x) {
  return x * 2
}

export default class Landscape {
  static dimensions () {
    const 
        x   = Euclidean.nearestTen(window.innerWidth)
      , y   = Euclidean.nearestTen(window.innerHeight)
      , gcd = Euclidean.gcd(x,y)

    const dimensions = [
        (y / gcd )| Math.pow(1/3) | Math.floor() | double()
      , (x / gcd) | Math.pow(1/3) | Math.floor() | double()
    ]

    return dimensions
  }

  static dataset (ctrl) {
    return {
        className         : Lazy.class
      , "data-background" : randomImage(images)
      , config            : (ele, isInitialized, ctx) => {
          if (isInitialized) {
            return ctrl.animate()
          }

          ctrl.preload()

          Lazy(ele)
            .bind(ctrl)
            .then(ctrl.reset)
            .then(ctrl.animate)  
      }
    }
  }

  static column (ctrl) {
    return (row, x) => {
      return bulma.landscapeColumn({ "data-y" : x }, row.map(Landscape.tile(ctrl, x)))
    }
  }

  static tile (ctrl, x) {
    return (_, y) => bulma.landscapeTile({ 
        "data-y" : x
      , "data-x" : y
      , onmouseenter : evt => evt.target.classList.add(raw.zoom)
      , onmouseleave : evt => evt.target.classList.remove(raw.zoom)
      , config   : (ele, isInitialized, ctx) => {
          if (isInitialized) return

          ctrl.nodes.inactive.push(ele)

          ctrl
            .queue( _ => Roll.animate(ctrl, ele) )

      }
    })
  }

  static view (ctrl, {title, subtitle}) {
    return m( 
        styles.landscape()
      , Landscape.dataset(ctrl)
      , bulma.headline(
            m("h1", "Benjamin Clos")
          , m("h2", "Full / Stack")
          , menu(styles.social(), social)
        )
      , ctrl
          | Landscape.column()
          | Matrix.create.apply(Matrix, Landscape.dimensions() ).map()
    )
  }

  static controller (outer) {
    return new Landscape(outer) 
  }

  constructor (outer) {
    this.schedule  = []
    this.nodes = {
        inactive : []
      , active   : []
    }
  }

  animate () {
    this.loaded = true
    this.schedule.forEach( job => setTimeout(job, 0) )
  }

  queue (fn) {
    this.schedule.push(fn)
    return this
  }

  reset () {
    this.nodes.active.forEach( node => node.classList.remove(raw.pixel) )
  }

  preload () {
    const {active, inactive} = this.nodes
    const again = () => setTimeout( _ => this.preload(), 100)
    if (this.loaded) return
    let [ele, rest] = List.random( inactive )
    if (!ele) return again()
    
    this.nodes.inactive = rest
    ele.classList.add(raw.pixel)
    active.push(ele)
    

    if (active.length < 10) {
      return again()
    }


    [ele, rest] = List.random( active )
    this.nodes.active = rest
    ele.classList.remove(raw.pixel)
    again()
  }

}