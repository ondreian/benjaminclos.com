import m         from "mithril"
import Home      from "views/Home"
import About     from "views/About"
import onlyEvery from "utils/onlyEvery"

function boot () {
  m.route(document.body, "/", {
      "/"      : Home
    , "/about" : About
  })	
}

window.onresize = onlyEvery( 100 ,  m.redraw )

document.addEventListener('DOMContentLoaded', boot)
