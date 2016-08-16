---
title: OO + Functional - Part 4 - The Lens
tags: javascript, functional, oop
draft: true
excerpt: The fourth part in my series on Monads in Javascript; combining Maybe and Either to create a Lens
---

The `Lens` allows one to safely access and set arbitarily deep properties on an `Object`, like this:

```javascript

const account = Maybe.of({})

const streetAddress = Lens.of("address", "street")

account(streetAddress) // null

streetAddress.put(account, "lazy lane")

console.log(account) // Maybe<{ address: { street: "lazy lane" } }>

```

Well that was cool.
