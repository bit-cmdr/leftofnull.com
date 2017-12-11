---
layout: post
title:  "ES6 Command-Line Parsing"
date:   2017-12-10 11:00:00 -0700
tags:
  - node.js
  - cli
disqus_id: 20171210
---

# ES6 Command-Line Parsing

ECMA Script has come a really long way and continues to add more great features. A lot of them borrowed from functional languages and libraries. Typically there isn't a lot of need for command-line argument parsing in this manner, there's a lot of great tools and libraries that already exist for handling more complex situations. There are times when you just want to write a quick little CLI tool to do one-off work. Without futher ado, here's how to do it.

### Desired input

Let's take a look at what we want the startup to look like. Typically you can run something like

```sh
node app 2 3
```

The problem is that when you use the default node tools, `process.argv`, to get the agruments passed in, you read everything, including `node` and `app` in the above example. The startup parameters aren't very clear either. What are 2 and 3? If you wrote the code, I would hope you would know, but maybe you inherited this or you wrote this tool for other devs on your team. What about them?

#### Doesn't this look nicer?

```sh
node app --base 2 --exponent 3
```

Just by looking at the parameters, you have a good idea of what might happen. Also, what we're going to implement, the order of the parameters doesn't matter, other than they will be expected to be paired in such a way that it always follows the convention of _name_ followed by _value_.

### Without parsing

Command:

```sh
node app 2 3
```

Code in `app.js`:

```js
const inputs = process.argv.slice(2)

console.info(
  `${inputs[0]} raised to the power of ${inputs[1]} = ${Math.pow(
    inputs[0],
    inputs[1]
  )}`
)
process.exit(0)
```

### Parsing function

```js
function parseArgs(args) {
  try {
    return Object.assign(
      ...args
        .slice(2)
        .reduce((l, r) => {
          if (!Array.isArray(l)) l = [[l, r]]
          else if (r.startsWith('--')) l.push([r])
          else l[l.length - 1].push(r)
          return l
        })
        .map(p => ({ [p[0].substring(2)]: p[1] }))
    )
  } catch (e) {
    console.error('Unknown argument passed', e)
    return {}
  }
}
```

Let's break this down.

1. We're using the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) `...` on `args` to expand `args` and iterate. Essentially we're ensuring `args` is an array. So we can perform the next set of operations and also for the very last step below.

1. `.slice(2)` is being used to drop the first 2 arguments, which would be `node` and `app`.

1. Now we can use `.reduce(...)`. [Reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) takes a function that takes two arguments and returns a single output. Many times you will see it depicted as taking a `left` and `right` argument, but it's really `accumulator` and `value`. You merge the `value` to the `accumulator`. I say merge, because you're reducing. The operation that reduces the `value` into the `accumulator` is entirely up to you, add, subtract, multiply, `Array.prototype.push` are all examples.

1. The function we are using to reduce will start off by taking the first two elements of the array, `l` will get index 0 and `r` will get index 1 on the very first run. Here `l` is a value and not an array, so we turn `l` into a multi-dimensional array of `[[l, r]]`, in our example `[['--base', '2']]`. The second iteration `l` will be the multi-dimensional array and `r` will be the next flag, in our example `'--exponent'`. So far the accumulator will look like `[['--base', '2'], ['--exponent']]`. For the last pass through we call `.push()` on the last array in our multi-dimensional array. This gives us a result of `[['--base', '2'], ['--exponent', '3']]`. If you have more, the process repeats until the end of the array. You can see here that it's vital, and expected that you pass in paired parameters. Having a straggler without a name won't work with this code.

1. Next we're calling `.map()` on the resulting multi-dimensional array. The map function performs an operation on each element of the array and returns the result. The end result is an equally sized array with the mapped values. For ours we are simply converting each array pair into an object. You'll see the `substring()` that's removing the expected leading `--` on each name. The array `['--base', '2']` becomes the object `{ base: '2' }`. Leaving you with an array of objects.

1. The last piece of the puzzle is the `Object.assign` that everything is wrapped in. Notice that we're using the spread operator at the beginning. This allows us to spread the object assign over each element in the array. Leading to one object `{ base: '2', exponent: '3' }`, which we return as the result of the function, or an empty object if there was an error.

#### All together

Your `app.js` should look like this

```js
function parseArgs(args) {
  try {
    return Object.assign(
      ...args
        .slice(2)
        .reduce((l, r) => {
          if (!Array.isArray(l)) l = [[l, r]]
          else if (r.startsWith('--')) l.push([r])
          else l[l.length - 1].push(r)
          return l
        })
        .map(p => ({ [p[0].substring(2)]: p[1] }))
    )
  } catch (e) {
    console.error('Unknown argument passed', e)
    return {}
  }
}

const opts = parseArgs(process.argv)

console.info(
  `${opts.base} raised to the power of ${opts.exponent} = ${Math.pow(
    opts.base,
    opts.exponent
  )}`
)
process.exit(0)
```

And call it

```sh
$ node app --base 2 --exponent 3
2 raised to the power of 3 = 8
```

or

```sh
$ node app --exponent 3 --base 2
2 raised to the power of 3 = 8
```

`opts` will now have the value of `{ base: '2', exponent: '3' }` no matter which way you ran the command line. It's also a lot easier to read in the code instead of trying to figure out which variable is in what index.

I also have a [Gist](https://gist.github.com/bit-cmdr/48b7d82ad93fe9e3043d61e842c0ebe3) available for easy commenting and copying.
