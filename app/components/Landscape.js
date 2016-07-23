import m                    from "mithril"
import {eles, styles, pipe} from "utils/bulma"
import Lazy                 from "utils/lazy"

export default class Landscape {
  static dataset (ctrl) {
    return {
        className         : Lazy.class
      , "data-background" : "/images/fields.jpg"
      , config            : Lazy(ctrl.animate)
    }
  }

  static view (ctrl) {
    return m( 
        styles.landscape()
      , Landscape.dataset(ctrl)
    )
  }

  static controller (outer) {
    return new Landscape(outer) 
  }

  constructor (outer) {

  }

  animate () {
    console.log("animate!")
  }
}