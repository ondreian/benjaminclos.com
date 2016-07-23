import m      from "mithril"
import top    from "config/navigation"
import social from "config/social"
import {pipe, bulma, styles} from "utils/bulma"

function nav (items) {
  return bulma.nav(bulma.navCenter(items.map( item => {
      return m(`a.${styles.navItem()}[href=${item.href}]`
        //, { href: item.href, config: m.route }
        , !item.icon 
            ? item.text 
            : [m(`i.${item.icon}`), item.text]
      ) 
    }))
  )
}

function menu (name, items) {
  return items
    | nav()
    | pipe.container()
    | pipe.section( 
        styles.navigation()
          | styles.isPaddingless() 
      )
}

export default function App (view) {
  return bulma.isFullheight( styles.app()
      , menu(".top", top)
      , view
      , menu(".bottom", social)
    )
}