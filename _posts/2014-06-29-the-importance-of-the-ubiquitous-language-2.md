---
layout: post
title: "The Importance of the Ubiquitous Language"
date: 2014-06-29 11:08:59 -0700
tags:
    - Development
    - Coding
    - Ubiquitous Language
disqus_id: 3
---

### Ubiquitous: */yoo-bikwit&#x259;ss/*

- **existing everywhere: present everywhere at once, or seeming to be**

### Language: */l&aacute;ng-gwij/*

- communication with words: the human use of spoken or written words as a communication system
- speech of group: the speech of a country, region, or group of people, including its vocabulary, syntax, and grammar
- **system of communication: a system of communication with its own set of conventions or special words**

### Ubiquitous Language:

- **system of communication: a system of communication with its own set of conventions or special words that exists everywhere within a given business domain**

Eric Evans first coined the term in his book on [Domain Driven Design](http://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software-ebook/dp/B00794TAUG/ref=tmm_kin_title_0), which is available in kindle-edition now by the way. If you haven't read it, I recommend adding it to you reasing list. I'll hone in on the same excerpt that Martin Fowler did in his [post on the topic](http://martinfowler.com/bliki/UbiquitousLanguage.html).

> By using the model-based language pervasively and not being satisfied until it flows, we approach a model that is complete and comprehensible, made up ofsimple elements that combine to express complex ideas.
>
> Domain experts should object to terms or structures that are awkward or inadequate to convey domain understanding; developers should watch for ambiguity or inconsistency that will trip up design.
>
> -- Eric Evans

When I start a new project, no matter how big or small, I like to take the time to fully understand what the users do as a workflow. I think all of us do to some extent. UX experts create [Journey Maps](http://www.uxmatters.com/mt/archives/2011/09/the-value-of-customer-journey-maps-a-ux-designers-personal-journey.php) to illustrate what they've learned from such sessions. I like to put together a Ubiquitous Language Dictionary. It's more of a wiki though, to be honest.

I'm sure you're familiar with the adage, "Measure twice, cut once." This is part of the measuring process. You are measuring your, and potentially the team's, understanding of the domain you are working in. In some cases you will be testing the users' knowledge as well. People are creatures of habit and we tend to do things without asking why, because it simply works. Your job is to ask why and to keep asking it until you've reached the bottom. Case in point, [why is Wednesday spelled as it is?](http://www.etymonline.com/index.php?term=Wednesday)

When I set out to start my dictionary for a project, I aim to gather two things right away; Nouns and Verbs. Nouns are, well, nouns. They are things like Product, Order, Employee, Manager, User, etc. Verbs are what you do with the nouns, Place an Order, Hire an Employee, Sell a Product, etc. In terms of self-documenting code, you can take the Nouns and make them your Domain classes or abstractions; Verbs become your methods either on the Domain classes or in an Application Service layer, if you've chosen that path. That's really another discussion though. This allows me to have a solid foundation to start with before the complexities come into play.

The complexities are that you almost always are going to have different user types or personas that use the system in different ways. A Product to a Customer means something different than a Product means to a Seller. They may have many similar properties, but the verbs around them to each persona could vary greatly. A Seller *Sells* a Product, a Customer *Buys* a Product. It's these nuances that you have to identify and figure out. This is where it gets complex in that you need to make sure you identify the global domain definition of a Product and its Verbs and what the Product means to all the different personas. It's okay to have a Noun and/or Verb listed multiple times in different, or similar, ways for each persona involved. So expect to have global Nouns and Verbs along with persona specific Nouns and Verbs. The separation is what Evans refers to as Contexts. In a given context Product means [insert definition here].

So why is this any more important than any other requirements gathering? Well this is where it all starts and ends, communication. If you're taking the time to speak and write code in the language of the customer, you reduce miscommunication and increase supportability of your software. It's been said that [homicidal maniacs read code too](http://www.jeremybytes.com/Downloads/CleanCode.pdf), make it easy on them so that when a user says, "Hey, I can't place an order," the next developer supporting the software can easily find the PlaceOrder method and start there. Your code now mimics the language of the user(s).

At the end of the day, if you're able to articulate to users the issues you're having or ask them about processes in their own language you will get a much more valuable response if you're all using the same vernacular. One thing that should set off red flags for you is when someone says you can use multiple terms for the same thing. Why? Are they truly the same? Are they the same thing, but at different phases in its life-cycle? Who uses which term when? These are the questions you need to ask when you encounter this. Keep in mind that language is a complex medium. It won't always be easy, but you can do it.

### [Conway's Law](http://en.wikipedia.org/wiki/Conway%27s_Law)

> organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations
>
> -- Melvin Conway

Another way of putting it is, why not try to change the communication structure of a team to match a system design that you want to build.

Happy Coding!