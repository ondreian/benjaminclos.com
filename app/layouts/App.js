import m                     from "mithril"
import top                   from "config/navigation"
import social                from "config/social"
import {pipe, bulma, styles, raw} from "utils/bulma"
import onlyEvery             from "utils/onlyEvery"

function route (href) {
  return (evt) => {
    if (href.match(/^external:/)) return
    m.route(href)
    return false
  }
}

function nav (items) {
  return bulma.nav(bulma.navCenter(items.map( item => {
      return m(`a.${styles.navItem()}[href=${item.href.replace(/^external:/, "")}]`
        , { onclick : route(item.href) }
        , !item.icon 
            ? item.text 
            : [m(`i.${item.icon}`), item.text]
      ) 
    }))
  )
}

function affix (ele) {
   if (!document.getElementsByClassName(raw.landscape).length && !ele.classList.contains(raw.detached)) {
    ele.classList.add(raw.detached)
    return
  }

  document.onscroll = onlyEvery(200, evt => {

    const isDetached = ele.classList.contains(raw.detached)
    
    const atTop = window.scrollY <= 30

    if (document.getElementsByClassName(raw.landscape).length === 0) {
      return ele.classList.add(raw.detached)
    }
    
    if (!atTop && isDetached) return
    
    if (atTop && !isDetached) return
    
    if (atTop && isDetached) {
      return ele.classList.remove(raw.detached)
    }
    
    if (!atTop && !isDetached) {
      return ele.classList.add(raw.detached)
    }
  })
}

/*
function persist (ele, isInitialized, ctx) {
  if (isInitialized) return
  ctx.retain = true
  affix(ele)
}
*/

function menu (name, items) {
  const className = name
    | styles.navigation()
    | styles.isPaddingless()

  return nav(items)
    | pipe.container()
    | pipe.section(className)
}

function header (items) {
  const className = styles()
    | styles.top()
    | styles.navigation()

  const inner = nav(items)
      | pipe.container()

  return m(className, { config: affix }, inner)

}

export default function App (view) {
  return bulma.app(
        header(top)
      , view
      , menu(styles.bottom(), social)
    )
}