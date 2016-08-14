---
title: Better Together - Part 1 - Monad
tags: javascript, functional, oop
author: Benjamin Clos
publishDate: 8-14-2016
excerpt: the first in a series of musings on the pairing of OOP and Functional programming. Beginning with jargon destructuring and building a base Monad.
---

Often times people talk about functional programming and object-oriented programming as though they were at odds.  However, they can work together with great efficacy, especially in the case of Javascript and even more so with the ability to inherit from Primitives in ES6.

As a preface, when talking about `Promise` in this article I am referring to the [bluebird](http://bluebirdjs.com/) module, which has many benefits over native the native `Promise` implementation.

## Glazed Donuts

When the word `Monad` is used peoples' eyes tend to (rightfully) glaze over like a dozen of the finest donuts from your local bakery at around 4 in the morning.  Before reading a few well written and less arcane blog posts on the topic, I was the same way.  **Fight the urge!**  They are worth [groking](https://en.wikipedia.org/wiki/Grok).

## What is a Monad?

*In addition to it being useful, it is also cursed and the curse of the monad is that once you get the epiphany, once you understand - "oh that's what it is" - you lose the ability to explain it to anybody.*
*- Douglas Crockford*

Let's hope he is wrong.  Monads have a strict mathematical definition, but for the purpose of this knowledge building exercise, we are going to gloss over (most) of that boring nonsense.  If you are very interested in it, you can research Category theory and Algebraic structures

**warning: reductive thinking ahead** 

Monads are a way to represent [states](https://en.wikipedia.org/wiki/State_(computer_science)#Program_state) in a way that allows you to account for logical branches, in a similar way to how an `if/else` or `switch` accounts for logical branches.  Where their power lies, is in their composability and reusability.  They lead to terse, understandable logical branching which enables a programmer to more readily understand the state of the current app, and by baking in guards against common pitfalls, allow you to write more fun code and less guard rails.

They are not special, they are just an abstraction about the state of a variable or expression at any given point of execution.

A `Monad` also implements an `fmap` method or `Functor map`.  What this jargon means, is a `Monad` provides a uniform way to transition (`fmap`) from one state (`Monad`) to another state (`Monad`)

This state transition ability (`fmap`) is what gives a `Monad` its powers, it is where a developer can manage side-effects or prempt invalid transitions.

an example of a common type of side-effect you might deal with, the undefined lookup:

```javascript
function getFullName (user) {
  if (!user)      return ""
  if (!user.name) return ""
  return `${user.name.first} ${user.name.second}`
}
```

Here you are checking to be sure you do not get the dreaded `TypeError: Cannot read property 'property' of undefined`.  This is precisely the type of side-effect a `Monad` can help you manage.

## The Base Monad

Let's take a look at how to implement a base `Monad` that has the traits we want.  Sometimes this is called the `Context` monad, but since we are going to use it as our base class to inherit from, we will simply call it `Monad`. 

*note*: This example uses ES6 on a modern Javascript engine, that allows inheritance from Native objects.

```javascript
const
  util     = require("util")

module.exports = class Monad extends Function {
  // implicit creation using `this` allows for
  // elegant subclass creation
  static of () {
    return new this(...arguments)
  }
  // in case we ever want an easy way to see if an object
  // is a Monad
  static isMonad (thing) {
    return thing instanceof Monad
  }
  // this explicit creator is very different than `Monad.of`
  // it allows us to access a base Monad instance from anywhere
  // on our prototype inheritance
  static Monad () {
    return new Monad(...arguments)
  }
  // returns a Monad that we can call like any other Function
  // const monad = Monad.of(1)
  // monad() // 1
  constructor (value) {
    super()

    return Monad.isMonad(value)
      ? value // don't need to nest Monads
      : Object.setPrototypeOf( 
            fn => !fn ? value : this.constructor.of(value).fmap(fn)
          , new.target.prototype
        )
  }
  // this is our fmap function, which a Monad may use to transition
  // from one value or state to another
  // it returns a new Monad of the transitioned value
  fmap (fn) {
    return this.constructor.of(fn(this()))
  }
  // allows us to compose a set of functions 
  // a bunch of `fmap`s
  // monad.compose(op1, op2, op3)
  compose (...fns) {
    return Array.prototype.concat.apply([], fns)
      .reduce( (monad, fn) => monad(fn), this)
  }
  // remember, mum is the word!
  get isMonad () {
    return Monad.isMonad(this)
  }
  // adding an inspect method makes our Monad play nicely with `console.log`
  // always treat debugging like a first-class citizen!
  inspect () {
    return `${this.constructor.name}<` + util.inspect(this()) + `>`
  }
}
```

While we have broken a couple of cardinal functional rules here by adding class properties to our Monad, we have ultimately made it much easier to utilize.  We've also given ourself a solid building block from which we can extend a variety of types of Monads.  However, one key feature we should add is the ability for Promises to "absorb" our Monads.

```javascript

class Monad {
  //... rest of our methods
  then (resolve, reject) {
    // fmap is an unary function for our base monad
    // but down the road it may be binary
    // and we do not want to limit our inheritance
    return this.fmap(resolve, reject)
  }
}

```

By adding this ability, we have given our Monads a lot of power to play nicely with traditional asynchronous flow handlers in Javascript.

When you are writing Javascript, please consider its context within the ecosystem.  Allowing it to cleanly integrate with other common patterns and libraries reduces cognitive overhead, and make your code more likely to be lasting and maintainable.

Now let's see what our new `Monad` can do:

```javascript

const inc  = x = x + 1
const zero = Monad.of(0)
console.log(zero)      // Monad<0>
console.log(zero())    // 0
console.log(zero(inc)) // Monad<1>
// Wheee we can use it with Promises to transition between states
Promise.resolve(zero).then(console.log) // 0
// what if we get a Promise from some external service?
Promise.resolve(0).then(Monad.Monad).then(console.log) // 0
// we can just pipe it into our explicity Monad creator
```

One common problem is: how do I get my value out of the Monad?

I think a better question to ask yourself might be: do I need to get it out or can I just transition (`fmap`) it to a different state?

Well that might seem underwhelming; it admittedly does not do much by itself, but it is going to be an important building block for part 2, when we introduce the `Maybe` monad and how to begin to deal with undefined lookup errors.