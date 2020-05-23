+++ 
draft = true
date = 2019-03-08T15:36:50-05:00
title = "Composing Functions in Typescript"
slug = "typescript-fn-composition" 
tags = ["typescript", "javascript"]
categories = ["dev"]
+++

When writing Typescript, it really forces you to make better functions by forcing each function to do one thing which is great for isolation, composability, and testing.  The issue comes when trying to visually and mentally decompose what the resulting composed operation is doing.  Visually it often presents itself as a "functional staircase" that you must very literally step through.

Let's create a simple example:

```javascript
const math = 
  pow(
    add(
      multiply(2, 3), 3), 2)
```

You can immediately see this is visually and mentally harder to deconstruct, and oftentimes people prefer variable allocation to this staircase pattern.

```javascript
const six = 
  multiply(2, 3)
const nine = 
  add(3, six)
const nine_squared = 
  pow(nine, 2)
```

But what happens if you want to refactor this code? 
Let's say we change the first statement:

```javascript
const twelve = 
  multiply(4, 3)
const nine = 
  add(3, six)
const nine_squared = 
  pow(nine, 2)
```

We now have a cascading problem, where all downstream variables depend on the name of the preceding result, instead of the actual operation being performed on the val.

Many functionally driven languages offer an elegant solution to this problem known as 
the pipe operator or `|>` in [Elixir](https://elixir-lang.org/getting-started/enumerables-and-streams.html#the-pipe-operator).  You may also recognize this from many shell environments where you can use `|` to pipe together commands.


Let's try to recreate something similar for us to use to compose our Typescript functions.

```javascript
/**
 * simplistic declaration of T -> U
 * could (should) be overloaded for production code
 */
declare interface Into<T, U> {
  (v: T, ...rest: any[]): U;
}
export default class Pipe<T> {
  /**
   * create a new Pipe with an initial value
   */
  static of<T> (val : T) : Pipe<T> {
    return new Pipe(val)
  }
  // the value of the pipe
  val: T;  
  private constructor (val : T) {
    this.val = val
  }
  /**
   * do something with a Pipe but discard the result
   */
  tap <U> (f: Into<T, U>, ...args: any[]) : Pipe<T> {
    const _discard = f.apply(this, [this.val].concat(args))
    return new Pipe<T>(this.val)
  }
  /**
   * |>
   */
  fmap <U>(f: Into<T, U>, ...args: any[]) : Pipe<U> {
    const next = f.call(this, ...[this.val].concat(args))
    return new Pipe<U>(next)
  }
  /**
   * unwrap a pipe
   */
  unwrap () {
    return this.val
  }
}
```

With this basic tool, let's try to rewrite our staircase above into something much flatter.

```javascript
const val = 
  Pipe.of(2)
    .fmap(multiply, 3)
    .fmap(add, 3)
    .fmap(pow, 2)
    .unwrap()
```

Now most importantly we can add or remove an operation without having to edit anything downstream from it, which makes the resulting operation more composable and terse.