import m          from "mithril"
import App        from "layouts/App"
import {bulma, pipe, styles} from "utils/bulma"

import sections   from "config/about"

export default class About {
  static controller () {

  }

  static width () {
    return styles.about()
      | styles.is4()
      | styles.isOffset4()
  }

  static wrapper (view) {
    return view
      | pipe.content()
      | pipe.column( About.width() )
      | pipe.columns()
      | pipe.main( styles.section() )
  }

  static section ({title, text}) {
    return bulma.section(
        m('h3', title)
      , m('p' , text)
    )
  }
  
  static view () {
    return App(
      sections.map(About.section)
        | About.wrapper()
    )
  }
}