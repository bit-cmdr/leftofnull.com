---
layout: post
title: "Rethrowing Errors for Proper Stack Trace"
author: alexander
tags:
  - Javascript
  - Error Handling
categories:
  - Javascript
  - Error Handling
image: assets/images/throwing.jpg
---

# Rethrowing Errors for Proper Stack Trace

Javascript, like many other languages provides the try/catch block for error handling. So what happens when you want to log the error but not handle it? That's when it's time to rethrow the error. Mind you there's a good argument for not doing this at all. Many times if you catch and rethrow you **will** be logging multiple errors and this isn't usually the best course of action. If all you're going to do is log the same error or similar error and rethrow, it's best not to catch the error at all, but instead just let it bubble up. Unless you're handling it in a logical way then the best place to handle errors is at the top-most functions.

Why would you want to log and rethrow then? Maybe you have a very deeply nested function and it has a lot of information that simply isn't available in functions that are higher up on the call stack. In this case maybe you do want to log and info or a warning message before rethrowing. There's decent arguments for this, especially in debugging. Regardless of your reasoning, here you are.

Let's look at two seemingly similar statements and see how differnt they really are.

Example A:

```javascript
catch (e) {
  throw new Error(e);
}
```

Example B:

```javascript
catch (e) {
  throw e;
}
```

If you use either of these and look at the error message in a calling function they will look identical, so what's the big deal? The big deal isn't the error message, but the stack trace. In **A** we're resetting the stack trace. In **B** we're preserving the stack trace. This concept is not unique to Javascript, many languages support it, especially if they support stack traces and try/catch. C# handles it in a similar way, however you can reset the stack trace in C# with `throw new Error(e)` *or* `throw e`, to presere it you just need to call `throw;` again. 

## What does any of this really mean? Let's look at some more robust examples.

Contrived, but more robust, examples. The goal will be to look at just the error information and determine where the error originated.

Here's our core functions and how they will handle errors

```javascript
async function throwAnError() {
  throw new Error('this is the end');
}

async function triggerErrorAndRethrow() {
  try {
    await throwAnError();
  } catch (e) {
    throw e;
  }
}

async function triggerErrorAndResetStack() {
  try {
    await throwAnError();
  } catch (e) {
    throw new Error(e);
  }
}
```

### Reset

Let's look at how resetting works

```javascript
async function contrivedResetExample() {
  try {
    await triggerErrorAndResetStack();
  } catch (e) {
    console.log(e);
  }
}

contrivedResetExample().then(() => console.log('done'));
```

The output of this is

```bash
Error: Error: this is the end
    at triggerErrorAndResetStack (/home/runner/rethrowerrorsexample/index.js:17:11)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
```

Not too shabby, now we know that the error is somewhere in the function `triggerErrorAndResetStack`. What if that function calls four or five different other libraries or functions and just has one `catch`? It's a start, but we can't tell *easily* that the offending code is in `throwAnError`, at least not yet.

### Rethrow

Let's see how rethrowing is different

```javascript
async function contrivedRethrowExample() {
  try {
    await triggerErrorAndRethrow();
  } catch(e) {
    console.log(e);
  }
}

contrivedRethrowExample().then(() => console.log('done'));
```

The output of this is

```bash
Error: this is the end
    at throwAnError (/home/runner/rethrowerrorsexample/index.js:2:9)
    at triggerErrorAndRethrow (/home/runner/rethrowerrorsexample/index.js:7:11)
    at contrivedExample (/home/runner/rethrowerrorsexample/index.js:24:11)
    at /home/runner/rethrowerrorsexample/index.js:42:1
    at Script.runInContext (vm.js:131:20)
    at Object.<anonymous> (/run_dir/interp.js:156:20)
    at Module._compile (internal/modules/cjs/loader.js:1133:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1153:10)
    at Module.load (internal/modules/cjs/loader.js:977:32)
    at Function.Module._load (internal/modules/cjs/loader.js:877:14)
```

We see the same error message, but wow is that a *lot* more information in the stack trace. Look! There it is at the top of the stack trace, the error originated in `throwAnError`! We immediately know the source of the error. There's little guess work other than, why did this happen?

## Explanation

Rethrowing is usually the best bet because it preserves the stack trace so that when something breaks, you know exactly where to look. If you're dealing with your own application, I would argue that there's very little reason to reset a stack trace, always preserve it if you're going to pass the error on.

So why *wouldn't* you always want to know the source of the error? Many times you do and you should be rethrowing. One of the reasons not to is for libraries. If you're making a package for Node or a class library for C#, it's not very valuable to tell consumers that the error originated in a sub-dependency. That may be a case for you to log a warning and then reset the stack trace. The consumer is usually only concerned with where the error originated so that they can fix it. If you're communicating that the error is in a sub-dependency it can mask where the true error is in their code. It can also be discouraging or misleading if they don't know how to fix it based on the error message. This isn't a hard and fast rule, but something to consider.