import m      from "mithril"
import css    from "styles/app"

const classNames = Object.keys(css)

function camelCaseCSS (str) {
  return str.split("-").reduce( (dromedary, str, i)=> {
    if (i == 0) return dromedary + str
    return dromedary + str.charAt(0).toUpperCase() + str.slice(1)
  }, "")
}

function argParser (className) {
  return (args) => {
    if (typeof args[0] === "string") { args[0] = className + args[0] }
    else                             { args.unshift(className)       }
    return args
  }
}

export const raw = classNames.reduce( (raw, className)=> {
  raw[ camelCaseCSS(className) ] = css[className]
  return raw
}, {})

export const styles = classNames.reduce( (styles, className)=> {
  styles[ camelCaseCSS(className) ] = (prev) => {
    const dynamicClass = `.${css[className]}`
    return !prev 
      ? dynamicClass
      : prev + dynamicClass
  }
  return styles
}, (className) => className ? `.${className}` : "")

/**
 * translates all of our CSS definitions to Mithril definitions
 *
 * @type       {Object}
 */
export const bulma = classNames.reduce( (helpers, className) => {
  const parser = argParser( `.${css[className]}` )
  helpers[ camelCaseCSS(className) ] = function (...args) {
    //console.log("ele : ", parser(args),  m.apply( m, parser(args) ))
    return m.apply( m, parser(args) )
  }
  return helpers
}, {})


/**
 * functional pipeline operators
 * 
 * @type       {Object}
 * 
 * @example
 *    eles
 *      |> pipe.ol(".example")
 */
export const pipe = classNames.reduce( (helpers, className) => {
  const parser = argParser( `.${css[className]}` )

  helpers[ camelCaseCSS(className) ] = function (...args) { 
    args.push(args.shift())
    return m.apply( m, parser(args) )
  }
  return helpers
}, {})