---
title: OO + Functional - Part 2 - The Big Maybe
tags: javascript, functional, oop
author: benjamin clos
draft: true
excerpt: the first in a series of musings on the pairing of OOP and Functional programming. Beginning with the base Monad and Maybe.
---

## Call Me Maybe?

With our base `Monad` in tow, let's create a useful `Maybe` monad that allows us to safely chain empty values.

## Articulating The Imbalance

Let's take a classic example of a nonuniform state transition in Javascript.

![lol javascript](http://imgs.xkcd.com/comics/schrodinger.jpg)

```javascript
let user1 = Users.find(fakeId) // undefined
let user2 = Users.find(readId) // { name : "jake" }

user1.name // throws
user2.name // is fine!
```

We have stripped this down to a simplified version, but it is very common for the `User` to have come from some outside service.  That service may respond with just a `User` or maybe `Nothing`.

`Nothing` in the context of Javascript is `null` or `undefined`.  While not   These values cause all sorts of problems for Javascript developers.

In a few of the following posts we will talk more about a few different types of `Monad` which allow us to handle this Schrodinger's variable conundrum.


```javascript

const
  Monad = require("./Monad")

module.exports = class Maybe extends Monad {
  // creating an explicit static property
  // allows Maybe to play nicely with fmap
  static Maybe (val) {
    return new Maybe(val)
  }
  // as long as this is empty it's a NOOP
  fmap (fn) {
    return new this.constructor( this.isEmpty ? this : fn(this()) )
  }

    // don't tell the Functionalist zealots I did this
  // in Javascript this makes our life a lot easier
  get isNothing () {
    return this() === undefined || this() === null
  }
}

```

Now we are getting into the interesting bits.  Let's try something to highlight the utility of our new `Maybe` vs `Monad`

```javascript

const creditsInEuros = user => user.credit * 1.34 // arbitrary conversion rate

const empty = Monad.of(undefined)
const user  = Maybe.of(undefined)

console.log(creditsInEuros(undefined))  // Throws
console.log(empty(creditsInEuros))      // Throws as well
console.log(user(creditsInEuros))       // Maybe<undefined> : No Error!

```

This seemingly arbitary difference is incredibly important, because we have reduced our cognitive overhead for defensive programming. This is so we can easily compose logical branches, without knowing about the state of the previous branches before it.

This is the same idea, written in a more traditional `if/else` approach

```javascript

// if we were to rewrite our creditsInEuros in a more traditionally 
// defensive way. ternary used for brevity
const creditsInEuros = user => user ? user.credit * 1.34 : undefined

```


Let's consider a more involved scenario:

```
Lookup a User => {User|Null}
  -> Do something with {User|Null}
```

Let's take a stab at writing the first step with our `Maybe`

```javascript
const 
    Promise         = require("bluebird")
  , nonExistantUser = null
  , {Maybe}         = require("./Maybe")
  , Fred            = { name : "fred" }

Promise.resolve(nonExistantUser).then(Maybe).then( whoops => {
  throw "I should have never ran"
}).catch(console.log)
Promise.resolve(realUser).then(Maybe).tap(console.log)
/*
output :
{ name: 'fred' }
doesn't throw because Maybe 
*/

```

Well look at that.  We just gracefully handled a null lookup in our Promise chain.  Please note we are using the more explicit `Maybe` creation via `Maybe.Maybe` in our example by destructuring the `Maybe` class with `{Maybe}`.  This could also be accomplished using [`Promise.prototype.bind`](http://bluebirdjs.com/docs/api/promise.bind.html) method and `Maybe.of`.

Take a stab at rewriting it using `bind` and `Maybe.of` in the comments below!

In my next post about marrying Functional programming with OOP, I will discuss how you can create and use the `Either` monad to gracefully handle `empties`.

