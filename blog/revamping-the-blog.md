---
title: Revamping The Blog
tags: meta, javascript, bulma
excerpt: how I chose the current stack for my blog and personal website.
publishDate: 7-21-2016
tldr: ran into some hiccups, wrote a brunch plugin, feel satisfied for the moment.
---

In an attempt to streamline my workflow for blogging, I recently decided to revamp my blog.  The first step for me was to come up with my desired features:

  * statically compiled Markdown to HTML
  * a tag system
  * a draft system
  * Disqus support
  * interoperability with the Brunch ecosystem
  * minimal configuration
  * no need to write Javascript to manage anything

After spending some time looking for an already authored plugin, I came away fruitless. I knew I was going to have to get my hands dirty.  It was not my first rodeo with riding a Brunch plugin, but it had been awhile since I had delved into the core of the ecosystem and I knew that quite a bit had changed.  After an hour or so of hacking away I had a functional plugin already fleshed out, and that is when I came across this gem in the Brunch [documentation](http://brunch.io/docs/using-plugins):

*To make your JS component aware of the actual class name, a compiler can allow you to require that css file to get information about its class name mappings, Note: this exmaple is real. CSS modules are supported by several core stylesheet compilers with a configuration option: stylus-brunch, sass-brunch, and css-brunch.*

Immediately, I knew this feature was something I wanted to use on both the blog and the SPA.  I almost always use [Mithril.js](https://mithril.js.org) for my work when I can, and my personal website is no exception.  With this, I could dynamically generate functions that created my Mithril elements from my CSS framework.  For this website I had already chosen [bulma](https://bulma.io).  This meant I could write my Mithril views like this:


```javascript
function section ({title, text}) {
  return bulma.section(
      bulma.title(title)
    , bulma.paragraph(text)
  )
}
```

The next step was getting it working with the static compilation part of the build, as the CSS classes are mangled in this CSS-JS interop, turning `.someClass` into `.someClass_w7jv7_238` which means my static content compilation needed to also be aware of the interop, so I could use them in the Pug templates.

After a bit of head scratching on how to reconcile the two compile paths and some back and forth with fellow developer and friend [@jonlim](https://twitter.com/@jonlim) I resolved to add an `onCompile` hook, which occurs after Brunch compiles, and check the resulting source graph for any source files that were not Javascript, but were being output Javascript by Brunch.  After a bit of playing, I had it working and could now write the templates for my blog while using my sass definitions like so:

```jade
extends ../layout

block main
  header
    div(class=css.content)
      h1(class=css.title) posts
```

So far, so good, and we will just have to see how it goes for a couple of months.  I went a head and published the plugin to help someone quickly get a static blog up and running called [brunch-blog](https://github.com/ondreian/brunch-blog) on NPM, feel free to use it and give me some feedback, report an issue or open a pull-request.