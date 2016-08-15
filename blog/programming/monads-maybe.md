---
title: OO + Functional - Part 2 - The Big Maybe
tags: javascript, functional, oop
author: Benjamin Clos
draft: true
excerpt: The second part in a series of thoughts on the benefits of marrying Functional and OOP principles, focusing on extending the Monad as a Maybe.
---

This is the second post in a series of posts on the benefits of merging Functional Javascript with Object-Oriented Javascript.  The `Monad` class we are referencing here we previously defined in [the first post](/blog/better-together-part-1-monad/).  

## Call Me Maybe?

With our base `Monad` in tow, let's create a useful `Maybe` monad that allows us to safely short circuit when we find a `Nothing` in our computational chain.
`Nothing` in the context of Javascript is `null` or `undefined`.  The concepts can be applied to a variety of languages, for instance `nil` is the Ruby and Elixir equivalent of `Nothing` and in python it is `None`.

Let's take a classic example of a nonuniform state transition (where we may have a null value or an Object) in Javascript.

```javascript

Users.find(fakeId).then( user => {
  user.name // throws
})

Users.find(realId).then( user => {
  user.name // is fine!
})

```

![lol javascript](http://imgs.xkcd.com/comics/schrodinger.jpg)

We don't actually know if user is `Nothing` until we look, and this can cause all sorts of problems for Javascript developers, experienced and beginners alike.

## Call Me Maybe?

Let's create our `Maybe` monad to help with this problem.


```javascript

const
  Monad = require("./Monad")

module.exports = class Maybe extends Monad {
  // creating an explicit static property
  // allows Maybe to play nicely with dot notation creation
  static Maybe (val) {
    return new Maybe(val)
  }
  // as long as this is empty it's a NOOP
  fmap (fn) {
    return new this.constructor( this.isNothing ? this : fn(this()) )
  }

  // don't tell the Functionalist zealots I did this
  // in Javascript this makes our life a lot easier
  get isNothing () {
    const self = this()
    return self === undefined || self === null
  }
}

```

Now we are getting into the interesting bits.  Let's try something to highlight the utility of our new `Maybe` vs our base `Monad`

```javascript

const creditsInEuros = user => user.credit * 1.34 // arbitrary conversion rate

const zilch = Monad.of(undefined)
const user  = Maybe.of(undefined)

console.log(creditsInEuros(undefined))  // Throws
console.log(zilch(creditsInEuros))      // Throws as well
console.log(user(creditsInEuros))       // Maybe<undefined> : No Error!

```

This seemingly arbitary difference is incredibly important, because we have reduced our cognitive overhead for defensive programming. This is so we can easily compose logical branches, without knowing about the state of the previous branches before it.

This is the same idea, written in a more traditional `if/else` approach

```javascript

// if we were to rewrite our creditsInEuros in a more
// traditional short-circuit
const creditsInEuros = user => {
  return user && user.credit && user.credit * 1.34
}

```


Let's consider a more involved scenario like User lookups and refactoring it to take advantage of our newly minted `Maybe` monad and the ability for our base `Monad` to be absorbed by a `Promise`.

```javascript
const 
    Promise         = require("bluebird")
  , nonExistantUser = null
   // destructure it so we utilize our pure creation interface
  , {Maybe}         = require("./Maybe")
  , Fred            = { name : "Fred" }

// We are going to use Promise.resolve to generalize some asynchronous lookup
Promise.resolve(null).then(Maybe).then( nonExistantUser => {
  throw "I should have never ran"
}).catch(console.log)

Promise.resolve(fred).then(Maybe).then(console.log)
/*
output :
{ name: 'fred' }
doesn't throw because Maybe 
*/

```

Well look at that;  we just gracefully handled a null lookup in our Promise chain.  Please note we are using the more explicit `Maybe` creation via `Maybe.Maybe` in our example by destructuring the `Maybe` class with `{Maybe}`.  This could also be accomplished using [`Promise.prototype.bind`](http://bluebirdjs.com/docs/api/promise.bind.html) method and `Maybe.of`.

Take a stab at rewriting it using `bind` and `Maybe.of` in the comments below!

In my next post about marrying Functional programming with OOP, I will discuss how you can create and use the `Either` monad to gracefully fallback to a default value with `Nothing`.

