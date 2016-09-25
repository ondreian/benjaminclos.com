---
title: OO + Functional - Part 5 - Ye Olde IO And You
tags: javascript, functional, oop, series:monads, asynchronous
author: Benjamin Clos
publishDate: 9-24-2016
excerpt: The fifth part in my series, diving into IO and some simplistic real-world uses.
---

Hopefully by now you are comfortable thinking about writing javascript in a slightly different way, continuing with our current topic we will introduce the concept of `IO`, and how to use it to recover from errors as we **asychronously** transition (`fmap`) from one state to another.

***Most of the following code will be very similar to how Promise works under the hood, please make an educated decision before doing something like this in production.  Other solutions, such as [bluebird](http://bluebirdjs.com/docs/getting-started.html) are a mature implementations with a lot of important optimizations.***

# IO

What we want out of our `IO` is a ran to run some `Function` or series of `Function` so that at each layer there are only two possible logic branches: `resolve` and `reject`.  That's right, the exact same logical branching as `Promise`.  The difference is that IO is not eagerly resolved, whereas a `Promise` is.

Let's visualize how these logical branches work:

![logical branching with IO](/graphics/io-monad-logic-branching-web.jpg)

A few lines of code are worth a million words of abstraction, let's look at how we might implement our `IO`.

```javascript

// naive "thennable" check to try to catch as many
// different Promise implementations as possible
function isPromise (thing) {
  return thing && typeof thing.then === "function"
}
    
module.exports = class IO extends Monad {
  /**
   * Determines if is IO
   *
   * @param      {Any}   thing   The thing
   * @return     {boolean}  True if io, False otherwise.
   */
  static isIO (thing) {
    return thing instanceof IO
  }
  /**
   * thennable absorption function
   * since IO is a thennable it also handles that

   * @param      {Any}       val      The value
   * @param      {Function}  resolve  The resolve fn
   * @param      {Function}  reject   The reject fn
   */
  static absorb (val, resolve, reject) {
    return isPromise(val)
      ? val.then(resolve, reject)
      : resolve(val)
  }
  /**
   * helper to ensure we can functionally throw Errors
   */
  static throw (err) {
    throw err
  }
  /**
   * creates a static IO that has the Identity of val
   *
   * @param      {Any}  val     The identity of this IO
   * @return     {IO}           The IO instance   
   */ 
  static of (val) {
    return new this( (resolve, reject) => resolve(val) )
  }
  /**
   * creates an IO instance out of an arbitrary binary function
   * which accepts resolve and reject arguments
   *
   * @class      IO (name)
   * @param      {Function}  fn      The function
   * @return     {IO}                The IO instance
   */
  static IO (fn) {
    return new IO(fn)
  }
  /**
   * performs our asynchronous 
   * operation wrapped in try/catch
   *
   * @param      {Function}  resolve  The resolve
   * @param      {Function}  reject   The reject
   * @param      {Function}  fn       The function
   */
  static perform (resolve, reject, fn) {
    // this is just to prove the asynchronousity of our
    // logic.  You may or may not actually want to do this
    // in real world code depending on a variety of factors.
    setImmediate( function () {
      try {
        const val = fn(resolve, reject)
        if (isPromise(val)) IO.absorb(val, resolve, reject)
      } 
      catch (err) {
        isFunction (reject)
          ? reject(err)
          : IO.throw(err)
      }
    })
  }

  /**
   * Constructs the IO
   *
   * @param      {Function}  fn      The function
   * @return     {IO Function}       The IO instance
   */
  constructor (fn) {
    if (!isFunction(fn) && !isPromise(fn)) {
      // if it isn't a promise or a thennable
      // make it a static IO
      return IO.of(fn)
    }
    // don't nest IO structures
    if (IO.isIO(fn)) return fn

    return Object.setPrototypeOf( (resolve, reject) => {
      const val = IO.perform(resolve, reject, fn)
    }, new.target.prototype)
  }

  /**
   * run our IO instance
   *
   * @param      {Function}  resolve  The resolve
   * @param      {Function}  reject   The reject
   * @return     {void}  
   */
  run (resolve = noop, reject = IO.throw) {
    this(resolve, reject)
  }

  /**
   * supporting Promises through a thenable interface
   *
   * @param      {Function}  resolve  The resolve
   * @param      {Function}  reject   The reject
   */
  then (resolve, reject) {
    this.run(resolve, reject)
  }

  /**
   * recover from Errors in our IO
   *
   * @param      {Function}  fn      The recovery function
   * @return     {IO}                The IO instance
   */
  recover (fn) {
    return this.constructor.IO( (resolve, reject) => {
      this(resolve, err => {
        resolve(fn(err))
      })
    })
  }
  /**
   * we cannot inspect Asynchronous values ahead of time
   *
   * @return     {String}  placeholder value
   */
  inspect () {
    return `<${this.constructor.name}:asynchronous>`
  }
  /**
   * our state transition in our IO sequence
   *
   * @param      {Function}  fn      The function
   * @return     {IO}                A new IO instance
   */
  fmap (fn) {
    return this.constructor.IO( (resolve, reject)=> {
      this( val => {
        // The previous value could be anything
        // so our IO must absorb it before we 
        // transition to its next state
        IO.absorb(val, resolved => {
          IO.perform(resolve, reject, _ => {
            // absorb the state transition
            IO.absorb(fn(resolved), resolve, reject)
          })
        }, reject)
      }, reject)
    })
  }
  /**
   * bind an IO to a resolve and reject Function
   * this provides an easy interface for usage where
   * you want your IO to be `this` agnostic, such as
   * setTimeout and setInterval.
   *
   * @param      {Function}  resolve  The resolve
   * @param      {Function}  reject   The reject
   * @return     {Function}           The bound IO
   */
  bind (resolve, reject) {
    const self = this
    return function boundIO () { self.run(resolve, reject) }
  }
}


```

Hopefully there are enough comments to understand all of the basics of what we are doing with our `IO`.  While this is very similar to how a `Promise` works, with remember our `IO` is not eagerly evaluated.  Let's highlight this difference with a small example:

```javascript
const ioFour = IO.of(4)
const double = x => x * 2

// this is immediately tries to resolve the value
// of the Promise chain asychronously
Promise.resolve(4).then(double)
// this has just created a series of lazy IO operations
const eight = ioFour.fmap(double) 
// the <IO:eight> is only evaluated now
eight(console.log)
```

Since our IO provides `IO.prototype.then` or a `thennable` interface, we can still mix these eager and lazily evaluated constructs safely without some of the traditional problems associated with mixing eager and lazy logic.  How about we build something slightly more interesting with our `IO`;  a simplistic Caching layer.

First we are going to need a util to make our requests:

```javascript
const https = require("https")
// simplistic get API request
function req (url) {
  return new Promise( (resolve, reject)=> {
    https.get(url, function(res){
      let body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
        resolve(body)
      });
    }).on('error', reject)
  })
}
```

and then we need to make a `Cache` that inherits from our `IO`:

```javascript
class Cache extends IO {
  /**
   * creates the Cache
   *
   * @param      {Integer}  ttl     The ttl in milliseconds
   * @return     {Cache}            The instance
   */
  static create (ttl) {
    // put it in an IO wrapper
    return Cache.of({ store: {}, ttl })
  }
  /**
   * creates an fmap for a url
   *
   * @param      {Url}   url     The url
   * @return     {Cache}         an IO branch for the URL
   */
  fetch (url) {
    return this.fmap( cache => {
      const 
          { store, ttl }     = cache
        , cached             = store[url] = store[url] || {}
        , { result, expiry } = cached
      // should we refresh our local copy from the remote?
      if (!expiry || Date.now() > expiry )  {
        return req(url).then( result => {
          console.log(`[cache] miss >>> ${url}`)
          cached.result = result
          cached.expiry = Date.now() + ttl
          return Promise.resolve(result)
        }).catch( err =>  {
        // was there some sort of Error?
          console.log(`[cache] error >>> ${err.message}`)
          cache.expiry = 0
          cache.result = null
          Promise.resolve(null)
        })
      }
      // Use the local cached copy
      console.log(`[cache] hit  >>> ${url}`)
      return Promise.resolve(result)
    })
  }
}
```

Now let's write something that takes our `Cache` and fetches a url when it has expired after 5 seconds or returns the cached version otherwise.

```javascript
const 
    cache  = Cache.create(5000)
  , nasa   = cache
      // some random nasa url to test against
      .fetch("https://api.nasa.gov/planetary/apod")
      // and then after we fetch it we want to parse it!
      // in the real world it's better to parse once prior
      // to caching the response, so you only have to run
      // JSON.parse once, but this is for demonstration
      .fmap(Maybe)
      .fmap(JSON.parse)
  , log = type => val => console.log(`${type} : `, val)
    // we want to bind it to be `this` agnostic for our
    // setInterval
  , run = nasa.bind(log("success"), log("error"))

setInterval(run, 2500)

```

Since we do not have an API key, NASA probably will not like us, so you should see something like this:

![io cache output](/graphics/monad-io-cache.png)

The important bits are in the hits and misses, our IO is doing our work for us, as we now have defined a safe logic tree to repeat at a fixed interval that can help to mitigate some of the [logical overhead of dealing with networks](https://blogs.oracle.com/jag/resource/Fallacies.html)

That is it for now on my thoughts of how to pair functional programming paradigms with more traditional oop concepts.  Hopefully you have seen how simple, well-thought building blocks can provide both ergonomics and safety to your code that makes it easy to reasonable about the state at any given point, while flattening your asynchronous code in a manner that limits the spaghetti.










