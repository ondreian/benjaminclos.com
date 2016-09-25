---
title: OO + Functional - Part 4 - The Lens
tags: javascript, functional, oop, series:monads
excerpt: combining Maybe & Either to create a Lens.
publishDate: 8-25-2016
---

If you recall at the end of my [last post](/blog/oo-functional-part-3-either-/) we discussed that we still have problems both setting and getting deep properties on an `Object`.

*what if I were to tell you that there is something to assist with this?*

Let's look at how we might want our API to look:

```javascript

const
    {Lens}   = require("../monads/Lens")
  , {Maybe}  = require("../monads/Maybe")
  , account  = Maybe({ name : "george" })
  , nothing  = Maybe(null)
  , address  = Lens("address")
  , street   = Lens("street")
  // we want Lens to be composable!
  , streetAddress = address(street)

streetAddress(undefined)
// Maybe<undefined>

streetAddress.put(account, "lazy lane")
// Maybe<{ name: 'george', address: { street: 'lazy lane' } }>
// 
streetAddress.put(nothing, "100 East Nowhere St.")
// Maybe<null>

/*
 * by returning an <Either> from our lens 
 * we can gracefully recover if desired
 * or just let it short-circuit
*/
streetAddress(account)
// Either<'lazy lane'>

streetAddress(null).fmap(console.log)
// Either<null>

```

We seem to want a lot of features, given how few and small our building blocks are.  Let's take a step forward in our process and talk about composition which will allow us to compose a set of `Lens` objects into a singular `Lens`

## Composition

First, we now realize we want a way to `compose` our state transitions, and since this is a very useful property to have, let's give our base `Monad` the `compose` method so all of our Monads have access to it:

```javascript
class Monad extends Function {
  compose (...fns) {
    // flatten our functional pipeline
    return Array.prototype.concat.apply([], fns)
      // here we are applying our state transitions
      // through the composed functional pipeline
      .reduce( (monad, fn) => monad(fn) , this)
  }
}

```

It is important that we ensure we are adding developer ergonomics by flattening our pipeline before we apply it.  This extra effort makes it considerably more powerful.

## Lens - Get

Now that we have this new power of composition, let's put it to use by starting work on our `Lens` by first creating the ability to safely get properties:

```javascript

module.exports = class Lens extends Monad {

  static of (...path) {
    return new this(path)
  }

  static Lens (...path) {
    return new Lens(path)
  }
  /*
    Providing a functional way to introspect about the
    type of monad we are utilizing is important
  */
  static isLens (thing) {
    return thing instanceof Lens
  }

  /*
    a partially applied getter, which allows
    us to declare a series of state transitions
    or `fmap`s
  */
  static getter (key) {
    return obj => Either(obj).fmap( obj => obj[key] )
  }
  /*
    always make functional composition 
    a first-class citizen of our ecosystem
  */
  static concat (...lenses) {
    return Lens.of( ...lenses.reduce( (path, lens) => {
      return path.concat(lens.path || lens)
    }, []))
  }

  constructor (path) {
    // our path is an array, so let's
    // generate our lookup pipeline
    const getter = path.map(Lens.getter)
    const self  = Object.setPrototypeOf( val => {
      // make Lens composable with our introspection
      if (Lens.isLens(val)) return Lens.concat(self, val)
      return isMonad(val)
        ? val.fmap(self)
          // remember our Monad.prototype.compose ?
          // here we are using it to apply our 
          // previously generated pipeline to our value
          // returning an <Either> here allows
          // for graceful recovery or short-circuit
          // when a path is not found
        : Either(val).compose(getter)
    }, new.target.prototype)
    // make the path and getter public
    // so other extensions or compositions might use them
    return Object.assign(self, {path, getter})
  }
  // we need to override our base Monad inspect
  // because the Len.prototype.path is more 
  // representative of the internal state
  inspect() {
    return `${this.constructor.name}<` + util.inspect(this.path) + `>`
  }
}

```

Well that was a lot of lines of code (or comments), hopefully you can see where we are going with this.  Now we can use our Lens to get any property, whether it exists or not, and transition (`fmap`) it safely into another state.

## Lens - Put

 Now we need a way to `put` values though, as a `Lens` is not very useful without it.  Lets add some static and instance methods to our `Lens`:

```javascript

module.exports = class Lens extends Monad {
  /**
   * recursively crawl our Object structure
   */
  static put (focus, path, value, root) {
    // the current property to check
    // by shifting the values
    // we ensure we do not infinitely recurse
    const key = path.shift()
    // maybe sure we have something to focus on
    // for this iteration
    focus = Either(focus).or({})
    // if we are in our first put
    if (!root) root = Maybe(focus)
    // if we are out of properties to recurse
    // we should return the root reference
    if (!path.length) {
      focus.fmap( obj => obj[key] = value )
      return root
    }
    // je'recurse!
    return Lens.put( 
        focus.fmap( obj => obj[key] = obj[key] || {} )
      , path
      , value
      , root
    )
  }


  put (obj, val) {
    // ensure we are using a Monad
    // for this operation
    const focus = isMonad(obj)
      ? obj
      : Maybe(obj)

    // recast the obj back to its original Monadic type
    // or just return the result
    const recast = isMonad(obj) 
      // all well-behaved Monadic structures
      // in our ecosystem have a static `of`
      // creation interface
      ? val => obj.constructor.of(val)
      // or just return the identity of our state
      // transition (fmap)
      : val => val

    // utilizing fmap allows our previous logical branches
    // to transparently transition or handle this state transition
    // we should clone our path so that 
    // a Lens may be used more than once!
    return focus
      .fmap( ctx => Lens.put(ctx, this.path.slice(0), val) )
      .fmap(recast)

  }
}
```

Hopefully the line-by-line commentary in the code blocks are useful for dissecting what is occuring here.  Our `Lens` is now complete, with the ability to get and put arbitrarily nested properties.  There are a lot of excellent libraries out there already for many of these operations such as [ramda.js](http://ramdajs.com/0.21.0/docs/#lens)

Currently all of the Monads we have discussed are sychronous in nature. Next we will introduce a fundamental building block of asynchronous Monads; the `IO`.

