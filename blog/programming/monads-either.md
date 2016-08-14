---
title: OO + Functional - Part 2 - Either ||
tags: javascript, functional, oop
draft: true
excerpt: a the first in a series of musings on augmenting object-oriented javascript with functional techniques
---

## Either ||

While useful for a lot of situations, that are still many times where we may wish to recover from an `empty` value.  In the context of Javascript `empty` can probably be generalized to both `null` and `undefined`.  Some people feel that `[]` and `{}` are also empty, but since we are talking about a `Monad` I would disagree.  To assist with this we will create our `Either` implementation.

```javascript

const
  Monad = require("./Monad")

module.exports = class Either extends Monad {
  // explicit Either creation for flat `fmap`
  static of (val) {
    return new Either(val)
  }
  // curried Either creation
  // example :
  // const numeric = Either.or(0)
  // [1,2,3,undefined, null].map(numeric)
  static or (fallback) {
    return val => Either.of(val).or(fallback)
  }

  static Either (a, b) {
    return Either.isMonad(a)
      ? a.fmap(Either.of).or(b)
      : Either.of(a).or(b)
  }

  or (fallback) {
    return this.of( this.of(this).isEmpty ? fallback : this )
  }
}

// Example
const people = [{ name : "fred"}, undefined, {name : "mary"}]
  .map(Either.or({}))

console.log(Either.of(1).or(0))    // Either<1>
console.log(Either.of(null).or(0)) // Either<0>
console.log(people)
/*
[ 
    Either<{ name: 'fred' }>
  , Either<{}>
  , Either<{ name: 'mary' }> 
]
*/

```

As you can see this allows you to gracefully handle `empties`, but I am sure you are asking, what can we do with this we could not do with `Maybe`?

Next we will discuss how to compose our `Maybe` and `Either` to create a Javascript relevant version of a [`Lens`](https://www21.in.tum.de/teaching/fp/SS15/papers/17.pdf) to safely get and set properties anywhere on an `Object`.