---
layout: post
title: "Hot Dog Vending Machine in Go"
date: 2020-07-21 11:00:00 -0700
tags:
  - Go
  - GoLang
  - Threading
  - Async
disqus_id: 20200721
---

# Hot Dog Vending Machine in Go

Some years ago I had the pleasure of learning Clojure. We're not going to talk about Clojure much today, this post is about Go. One of the main resources I used when learning Clojure was a book by Daniel Higginbotham called Clojure for the Brave and True. You can read it online at https://www.braveclojure.com/clojure-for-the-brave-and-true/. I highly recommend this book if you're learning Clojure. This was one of my favorite programming books that I've read. 
In one of the later chapters we're introduced to concurrent processes with asyncrounous programming. One of the ways we can envision this is by creating a Hot Dog Vending Machine. Clojure has a concept for async programming in common with Go, channels. We're going to look more at channels and then build our Hot Dog Vending Machine using them.

## What are channels in Go?

Channels in Go are used for interprocess communication between different goroutines. It's a lightweight thread of execution that can run concurrently with the main thread. Let's look at some concrete examples. We'll start with [Go Routines](https://golang.org/doc/effective_go.html#goroutines), you'll also notice the next section is Channels.

Here's a straightforward function

```go
package main

import (
    "fmt"
    "time"
)

func f(from string) {
    for i := 0; i < 3; i++ {
        fmt.Println(from, ":", i)
    }
}

func main() {

    f("direct")

    time.Sleep(time.Second)
    fmt.Println("done")
}
```

Now let's add some go routines

```go
package main

import (
    "fmt"
    "time"
)

func f(from string) {
    for i := 0; i < 3; i++ {
        fmt.Println(from, ":", i)
    }
}

func main() {

    go f("goroutine")

    f("direct")

    go func(msg string) {
        fmt.Println(msg)
    }("going")

    time.Sleep(time.Second)
    fmt.Println("done")
}
```

In the second example the go routine is running concurrently to the main thread. Even though `"goroutine"` is used first, the `"direct"` message is what is being output first. You'll notice that we're calling `fmt.Println()` inside of the go routines, this is for a reason. We can't simply return a `string` because the go routine could be running on a separate thread. How do we get information in and out? In is pretty easy, you can see an example here, but what if we need to give additional information? Here's where channels come in.

Channels come in two flavors. Buffered and Unbuffered. Buffered channels have a limited number of messages they can receive, while unbuffered channels have no such limits. What happens if you send a message over the buffer limit to a buffered channel? Go `panic`s. Why would we want to use buffered channels then? One use case is when you have a function that acts as a factory to return a buffered channel each time it's called and you know the limits up front. Let's look at a simple channel  example.

```go
package main

import "fmt"

func main() {

    messages := make(chan string)

    go func() { messages <- "ping" }()

    msg := <-messages
    fmt.Println(msg)
}
```

What are all these arrows? Think of it like this, `channelVar <- "value"` is an assignment to the channel, while `someNewVar := <-messages` is receiving the value from the channel. Here we have a go routine that sends `"ping"` into the channel and `msg` is assigned that value from the channel. This is communicating concurrently across threads. I say it's across threads, but it's important to note that may not be the case in reality. Go will decide which is the best course of action, but it's easier to reason about in those terms. [GoLangBot has a great write up on the differences](https://golangbot.com/goroutines/).

Let's start building our Hot Dog Vending Machine.

## Vending Machine

Let's start with the basics of what we'll need. We'll need to ask how many hot dogs the machine has and how many we want first. So let's get a cli app up that asks those questions

```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	var input string

	fmt.Print("How many hot dogs in the vending machine? ")
	fmt.Scanln(&input)
	count, _ := strconv.Atoi(input)

	fmt.Print("How many hot dogs would you like? ")
	fmt.Scanln(&input)
	req, _ := strconv.Atoi(input)

	fmt.Scanln(&input)
}
```

We can reuse `input` at each question because we're converting it to an integer for both. Always use `strconv` package over `fmt.Sprint` whenever possible, it's faster and uses less resources. I'll write another article on that another time. Here's we're printing the question to the terminal, scanning in the user input to `input` and then converting it to and integer. In a real app we always want to handle `err`s, but we'll let that slide for this example. Also note that the last line is another `Scanln`, we'll have to hit enter again on the keyboard to end the program.

Here's the hot dog machine function that will be the heart of our program.

```go
func hotdogMachine(inventoryCount int) (chan<- string, <-chan string) {
	in := make(chan string)
	out := make(chan string)
	go func(hc int, in, out chan string) {
		for {
			currency := <-in
			switch {
			case hc > 0:
				switch {
				case currency == "dollar":
					hc -= 1
					out <- "hot dog"
				default:
					out <- "wilted lettuce"
				}
			default:
				out <- "all out"
			}
		}
	}(inventoryCount, in, out)
	return in, out
}
```

More arrows! What do they mean?! Well when you declare a channel you can declare it as a send-only, receive-only, or bi-directional.

```go
bidirectional := make(chan string) // can send and receive strings on this channel
sendOnly := make(chan<- string) // can only send strings on this channel
receiveOnly := make(<-chan string) // can only receive strings on this channel
```

What we've done is create two channels, `in` and `out`, both start off as bidirectional channels inside the function, but are returned as send-only and receive-only respectively, since that's how they should be used *outside* of this function. Inside it benefits us to have them bidirectional since we'll have to read from `in` and send to `out`. Next we have a go routine for the vending machine that also takes in a hot dog count `hc`, we do this to limit shared scope of variables. It's safer to pass the channels and hot dog count into the go routine so it can manage thread-safety better. The vending machine itself will return a `"hot dog"` when it receives a `"dollar"` and decrement the number of hot dogs left. If it receives any other denomination, it will return `"wilted lettuce"`. If it runs out of hot dogs, it will return a message of `"all out"`. Remeber in go, `switch` statements are favored over `if/else` chains as it's more readable and go doesn't support fallthrough mechanics like other languages.

So what does this all look like? How can we put it all together? Just a few tweaks to our main function.

```go
package main

import (
	"fmt"
	"log"
	"strconv"
)

func hotdogMachine(inventoryCount int) (chan<- string, <-chan string) {
	in := make(chan string)
	out := make(chan string)
	go func(hc int, in, out chan string) {
		for {
			currency := <-in
			switch {
			case hc > 0:
				switch {
				case currency == "dollar":
					hc -= 1
					out <- "hot dog"
				default:
					out <- "wilted lettuce"
				}
			default:
				out <- "all out"
			}
		}
	}(inventoryCount, in, out)
	return in, out
}

func main() {
	var input string

	fmt.Print("How many hot dogs in the vending machine? ")
	fmt.Scanln(&input)
	count, err := strconv.Atoi(input)
	if err != nil {
		log.Fatal("Unable to convert number of hot dogs for vending machine. Expected a number, received", input)
	}

	fmt.Print("How many hot dogs would you like? ")
	fmt.Scanln(&input)
	req, err := strconv.Atoi(input)
	if err != nil {
		log.Fatal("Unable to convert number of hot dogs wanted. Expected a number, received", input)
	}

	in, out := hotdogMachine(count)
	defer close(in)
	go func(out <-chan string) {
		for {
			fmt.Println(<-out)
		}
	}(out)
	in <- "pocket lint"
	for i := 0; i < req; i += 1 {
		in <- "dollar"
	}

	fmt.Scanln(&input)
}
```

You can see we've added a call to `hotdogMachine` and we're using the `in` and `out` channels. Next we have to remember to `defer close(in)` since it's a sending channel. We have a new go routine that's going to listen to messages coming out and print them to the screen. Last is a call to `in` to pass in some `"pocket lint"` to see if we get `"wilted lettuce"` followed by a loop for the number of hot dogs you asked for. Hitting enter an extra time will end the program.

That's it, a fully functional hot dog vending machine. Hopefully this helps you understand channels and go routines a litte better, sometimes they can be very confusing concepts at first. Another recommendation is if you're building your app for the first time, try it without go routines and channels first. The reason is twofold. First is that it's easier to reason about and much easier to find potential logical errors when getting started. The other being that there is an overhead to channels and go routines, you may sometimes find it faster to go without, but that may be getting into some micro-optimizations and if that's you're only issue, you're in a good place.

A challenge for you. How would you modify the program to ask if the user wants more hot dogs if the machine still has some left?

Checkout the full example on [GitHub](https://github.com/bit-cmdr/go-hotdog-vending-machine)
