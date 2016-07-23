import m    from "mithril"
import Home from "views/Home"

document.addEventListener('DOMContentLoaded', () => {
  m.route(document.body, "/", {
    "/": Home
  })
})
