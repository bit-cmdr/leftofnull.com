---
layout: post
title: "Constant Vigilance: Classes or Structs in C#"
date: 2014-03-19 11:08:59 -0700
tags: YAGNI C#
disqus_id: 5
---

I'm going to have a recurring theme on the blog from time to time. I'll probably have several, but this is the first. The theme here is constant vigilance. The same advice that Mad-Eye Moody gives to Harry Potter in the books. The constant vigilance theme will address poor coding habits that are encouraged by the tools we use. Don't get defensive just yet, and read on. If you disagree, I welcome your comments and will do my best to keep up.

## Constant Vigilance

Classes or Structs in C#
--

Many of the tools we use, such as ORMs, require us to map to POCOs (Plain Old CLR Objects). WCF encourages POCOs for DataContracts for DTOs and SOAP Objects. This is all fine as they suit the needs of their intended purposes. There's absolutely nothing wrong with it at all. The problem is us. The more these tools are used the more the format becomes old hat. We get used to doing things this way and never question mimicking it in our own systems, even when it's not needed. Let's look at the basic differences between the two.

### Classes

Classes are *generally* stored on the heap and are cleaned up when the garbage collector no longer detects any references and deems it safe to destroy. Classes are also *generally* passed by reference. In terms of C++, you're dealing with pointers. Albeit pointers that are managed and cleaned up for you. Keep in mind this is an overly simplistic view of classes and the same over simplicity holds true for the Structs section below. For a very in-depth analysis of stack vs heap, read [this article](http://blogs.msdn.com/b/ericlippert/archive/2009/04/27/the-stack-is-an-implementation-detail.aspx) by Eric Lippert.

Classes excel at a few things. They are good at/for:

- Encapsulating Data
- Hiding Data
- Inheritance
- Polymorphism
- Composition
- Abstraction

Keep that in mind when we look at the next section.

### Structs

Structs are *generally* stored on the stack. This alone gives them an advantage over Classes. The stack is accessed quicker than the heap. Mind you, this is a micro-optimization and you're at the mercy of the JITer you're using. This also means that they are generally disposed of upon loss of scope, meaning you don't have to wait for garbage collection to run.

Structs are also good at a number of things, like:

- Data Encapsulation
- Polymorphism

### So which should you use?

The answer, as always, is that it depends. Take a look at the lists above. Are you trying to hide implementation details? Use a Class. Are you taking advantage of abstraction, composition, or inheritance? Use a Class. Otherwise, you could use a Struct. I would even argue when you're using abstraction, if you're not inverting control, do you really need the abstract? True, you should strive to eliminate duplicate code, but sometimes it's worth a little exploration to see if one performs better than the other. Remember, it's a fine balancing act between a writing clean code and writing software that users ***want*** to use. If you're going to go against the grain though, make sure you comment as to *why* you are doing so.

### Examples

Let's say that you need to handle some events that look like this.

```c#
public class MyClassCreatedEvent
{
    public int Id { get; set; }
    public DateTime Stamp { get; set; }

    public MyClassCreatedEvent(int id, DateTime stamp)
    {
        Id = id;
        Stamp = stamp;
    }
}
```

There's nothing wrong with this, but couldn't it be as simple as:

```c#
public struct MyClassCreatedEvent
{
    public int Id;
    public DateTime Stamp;

    public MyClassCreatedEvent(int id, DateTime stamp)
    {
        Id = id;
        Stamp = stamp;
    }
}
```

There really isn't much difference between the two, but there's no reason at this point to make it a Class. I say 'at this point' because you may need to change it down the road. **That's okay.** Software changes, it's inevitable. This is where YAGNI comes into play. If you don't need it *right now*, then don't waste effort on building it right now. This again is a balancing act, but the point is to not do more than you need to, because what you think you need may change tomorrow.