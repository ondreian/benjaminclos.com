import m          from "mithril"
import App        from "layouts/App"
import {bulma}    from "utils/bulma"
import Landscape  from "components/Landscape"

export default class Home {
  
  static controller () {
    return new Home()
  }

  static view (ctrl) {
    return m.component(Landscape, ctrl)
      | App()
  }

  constructor (ctrl) {
    
  }

  
}