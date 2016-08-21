---
title: OO + Functional - Part 3 - Either ||
tags: javascript, functional, oop, series:monads
publishDate: 8-21-2016
excerpt: The third in a series of musings on pairing OOP with functional paradigms; recovering from empty values with the Either monad.
---

In the [last segment](/blog/oo-functional-part-2-call-me-maybe/) we extended our `Monad` to create `Maybe` which allowed us to shortcircuit `Nothing` operations.  Today we are going to continue with this extending our logical branching by creating the `Either` monad.  The `Either` allows us to recover or transition (`fmap`) from `Nothing` to our default value.

Let's work on our `Either` implementation:

```javascript

const
  Maybe = require("./Maybe")

module.exports = class Either extends Maybe {
  // explicit Either creation for flat `fmap`
  static Either (val) {
    return new Either(val)
  }
  // curried Either creation
  static or (fallback) {
    return val => Either.of(val).or(fallback)
  }
  // so we can chain our fallback value
  or (fallback) {
    return this.of( this.isNothing ? fallback : this )
  }
}
```

Well that was not very much code, but it will be yet another powerful building block. We have also introduced a new concept with the static `or` method, where we are [partially applying](https://en.wikipedia.org/wiki/Partial_application) the creation of our `Either` with a higher-order function.

***Higher-order Functions:***
*Functions that both accept functions as arguments and return functions as results.*

***Partial Application:***
*Translating a function that is executed with a set of arguments and into a series of functions each accepting one or more of the arguments until the set is full, where the function then executes with the completed set of arguments.*

***Currying:***
*Translating a function that is executed with a set of arguments into a series of ***unary*** functions, or functions that only accept 1 argument.*

Because we know that our Either branch is a binary logic chain, that is to say it can only have 2 possible branches (value or fallback), we only need a naive partial application approach.

This allows us to return a partially applied `Either` that has a pre-determined fallback logic branch.  How about we use this in an example:

```javascript
const
    Promise     = require("bluebird")
  , Either      = require("../monads/Either")
  , fred        = { name : "fred" }
  , george      = { name : "george" }
  // our partially applied Either function
  , orAnonymous = Either.or({ name : "anonymous" })

console.log(Either.of(undefined).or(fred)) 
// Either<{ name: 'fred' }>

console.log(Either.of(george).or(fred)) 
// Either<{ name: 'george' }>

// mock looking up an array of connections
// where people may or may not be authenticated with the service.
const getActiveUsers = _ => Promise.resolve([ 
    fred
  , george
  , null
  , undefined 
])

getActiveUsers().map(orAnonymous).then(console.log)
/*
[ { name: 'fred' },
  { name: 'george' },
  { name: 'anonymous' },
  { name: 'anonymous' } ]

*/

```

Well that is nice, but let's make the interface a little more intuitive with some OOP to extend our `Either` into a `User` that can either be logged in or anonymous.

```javascript
class User extends Either {
  // pure creation interface!
  // always expose something that 
  // plays nicely with Array.prototype
  static User (user) {
    return new User(user).or()
  }

  static get anonymous () {
    return { name : `anonymous-${User.UUID++}` }
  }

  or () {
    return this.of( this.isEmpty ? User.anonymous : this )
  }

}
// I cannot wait for ES6 static properties to hit Node.js
User.UUID = 0
```

That did not require too much work, but added a lot of expressiveness to our API with minimal overhead.  All we really had to do was come up with a generic way to name our anonymous users and override our default `Either.prototype.or` behavior.

Now let's see it in action:

```javascript
import {User} from "../monads/User"

console.log(User(null))
// User<{ name: 'anonymous-0' }>
console.log(User(fred))
// User<{ name: 'fred' }>
getActiveUsers().map(User).then(console.log)
/*
[ { name: 'fred' },
  { name: 'george' },
  { name: 'anonymous-1' },
  { name: 'anonymous-2' } ]
*/
```

As you may have noticed it is still a little awkward to handle deeply nested properties with our current toolset.  Performing an `fmap` on `fred.address.streetname` would still cause us to throw unless we were sure that the property existed.

In the next post, we will illustrate how to compose our `Maybe` and `Either` to create a Javascript relevant version of a [`Lens`](https://www21.in.tum.de/teaching/fp/SS15/papers/17.pdf) to safely get and set arbitrarily deep properies on an `Object`.