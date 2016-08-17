---
title: OO + Functional - Part 3 - Either ||
tags: javascript, functional, oop, series:monads
draft: true
excerpt: Functional + OOP = Winning; the third in a series of musings, focusing on the Either monad.
---

## Either ||

While useful for a lot of situations, that are still many times where we may wish to recover from an `Nothing` value.  In the context of Javascript `Nothing` can probably be generalized to both `null` and `undefined`.  To assist with this we will create our `Either` implementation.

```javascript

const
  Maybe = require("./Maybe")

module.exports = class Either extends Maybe {
  // explicit Either creation for flat `fmap`
  static Either (val) {
    return new Either(val)
  }
  // curried Either creation
  // example :
  // const numeric = Either.or(0)
  // [1,2,3,undefined, null].map(numeric)
  static or (fallback) {
    return val => Either.of(val).or(fallback)
  }
  // so we can chain our fallback value
  or (fallback) {
    return this.of( this.of(this).isNothing ? fallback : this )
  }
}
```

Well that was not very much code, but let's illustrate a few examples to give you an idea of how powerful this is:

```javascript
const
    Either      = require("../monads/Either")
  , fred        = { name : "fred" }
  , george      = { name : "george" }
  , orAnonymous = Either.or({ name : "anonymous" })

console.log(Either.of(undefined).or(fred)) // Either<{ name: 'fred' }>

console.log(Either.of(george).or(fred)) // Either<{ name: 'george' }>

const connections = [ fred, george, null, undefined ].map(orAnonymous)

console.log(connections)
/*
[ Either<{ name: 'fred' }>,
  Either<{ name: 'george' }>,
  Either<{ name: 'anonymous' }>,
  Either<{ name: 'anonymous' }> ]
*/

```

As you can see this allows you to gracefully handle `Nothing`, but I am sure you could be asking, what is the big difference between `Either` and `Maybe`?

The answer is: `Either` fallbacks to a default value when an `Nothing` is encountered, whereas `Maybe` does not run the transition to the next state when a `Nothing` is encountered.

Let's see how this difference might look in a more tradition `if/else` approach:

```javascript

// Maybe
function maybeish (thing) {
  thing && // do something to thing
}

// Either

function eitherish (thing) {
  thing = thing || "fallback value"
  // do something with thing
}
```

As you may have noticed it is still a little awkward to handle deeply nested properties, but next we will illustrate how to compose our `Maybe` and `Either` to create a Javascript relevant version of a [`Lens`](https://www21.in.tum.de/teaching/fp/SS15/papers/17.pdf) to safely get and set arbitrarily deep properies on an `Object`.