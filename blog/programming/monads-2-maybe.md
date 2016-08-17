---
title: OO + Functional - Part 2 - Call Me Maybe?
tags: javascript, functional, oop, series:monads
author: Benjamin Clos
publishDate: 8-17-2016
excerpt: The second part in a series of thoughts on the benefits of marrying Functional and OOP principles, focusing on extending the Monad as a Maybe.
---

*This is the second post in a series of posts on the benefits of merging Functional Javascript with Object-Oriented Javascript.  The `Monad` class we are referencing here we previously defined in [the first post](/blog/better-together-part-1-monad/).*

## Call Me Maybe?

With our base `Monad` in tow, let's create a useful `Maybe` monad that allows us to safely short circuit when we find a `Nothing` in our computational chains.

`Nothing` in the context of Javascript is `null` or `undefined`, a constant pain where most language generally only have a singular Constant to represent `Nothing`

Let's take a classic example of a nonuniform state transition where we may run into a problem with a `Nothing` in Javascript.

```javascript

Users.find(fakeId).then( user => {
  user.name // throws
})

Users.find(realId).then( user => {
  user.name // is fine!
})

```

![lol javascript](http://imgs.xkcd.com/comics/schrodinger.jpg)

We don't actually know if user is `Nothing` until we look, and this can cause all sorts of problems for Javascript developers, experienced and beginners alike.  The wise among you will note that you can use `Promise.prototype.catch` to handle such an error, but the added noise that this can incur in your `catch` handler generally distracts from the clarity of handling actual operational errors, like recovering from a network partition, an unreachable database, or a filesystem error via properly scoped [`Error`](http://bluebirdjs.com/docs/api/catch.html#filtered-catch) objects.

It would be more meaningful to simply short-circuit this type of operation most of the time.

## Call Me Maybe?

Let's extend our base `Maybe` to create our `Maybe` monad to help with this problem.


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

Since this extends the `Monad` and thus the `Function` we can transparently do some useful state transitions (`fmap`) with it. How about we give it a whirl to highlight the utility of our new `Maybe` vs our base `Monad`.


```javascript

const creditsInEuros = user => user.credit * 1.34 // arbitrary conversion rate

const zilch = Monad.of(undefined)
const user  = Maybe.of(undefined)

console.log(creditsInEuros(undefined))  // Throws
console.log(zilch(creditsInEuros))      // Throws as well
console.log(user(creditsInEuros))       // Maybe<undefined> : No Error!

```

This seemingly arbitary difference is incredibly important, because we now can decoupling our state transitions from our logical branches. This reduces our cognitive overhead, and adds a level of reliability and reuse to our logical branches (the `Maybe` in this case).  

This is the same idea, written in a more traditional `if/else` approach

```javascript

// if we were to rewrite our creditsInEuros in a more
// traditional short-circuit
const creditsInEuros = user => {
  // what if we later want to perform a similar `fmap`
  // on a user.cart where we want to the sum?
  // we have to copy this logic there.
  return user && user.credit && user.credit * 1.34
}

```

This is admittedly a simplistic scenario, but let's try something a bit more involved, like User lookups and refactoring it to take advantage of our newly minted `Maybe` monad and the inherited ability for our base `Monad` to be absorbed by a `Promise`.

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
doesn't throw because our Maybe absorbed the null state 
*/

```

Well look at that; we just gracefully short-circuited a null lookup in our Promise chain.  Please note we are using the more explicit `Maybe` creation via `Maybe.Maybe` in our example by destructuring the `Maybe` class with `{Maybe}`.  This could also be accomplished using [`Promise.prototype.bind`](http://bluebirdjs.com/docs/api/promise.bind.html) method and `Maybe.of`.

Take a stab at rewriting it using `bind` and `Maybe.of` in the comments below!

Another important logical branch is the ability to recover from a `Nothing`.
In my next post, I will discuss how you can create and use the `Either` monad to gracefully recover with a default value with `Nothing`.

