---
layout: post
title: "Choose Your Tools Wisely"
date: 2014-02-04 11:08:59 -0700
tags: Tools Coding Development IDE .NET JavaScript
disqus_id: 6
---

![choose your weapon](https://ucruhw.bn1304.livefilestore.com/y4mAmf8-ciaySzHWFU9conuLSKgzOEXd0rdaGWLGU3DJWMvb3nO-tkq11VM6IqYdvxid6IQdEqzyaW8u2npEpkLhrZEaSN2ulfyC33mIS5H5CNXWXil25OLaAHJh1bnDuaqs6d9BfaYfk8Zo9xnYs48jHdLH63IVcklv-7FcNovAz2IvPOtcVjD7mL9ZVplmN7bQh35B13nM9c4d7fIgLJO0g){:class="img-responsive"}

Let's face it programming a computer is a little more involved than programming a VCR (if you're old enough to remember those, [Wikipedia](http://en.wikipedia.org/wiki/Vcr) for those that don't). Those of us that have been doing it for a while can make it look easy but part of that starts with our tools. Let's look at the developers second most critical tool. An [IDE](http://en.wikipedia.org/wiki/Integrated_development_environment).

This topic came up where I currently work, [Neudesic](http://www.neudesic.com/Pages/default.aspx), with some other developers. They were soliciting advice on what IDEs we preferred for what languages. Understandably there was a lot of feedback and a lot of discussion on what was best. I'm only going to cover some for .NET and JavaScript because this post would never end if I didn't cut it off somewhere.

### What is an IDE

IDE stands for integrated development environment. It's a software tool that helps you write code. Some key features in this regard are intelligent code completion, build engines, source control integration, debuggers, and project file management. Some IDEs have all of these features, while others have a mixture of them. Like I said , they are tools that help you write code. If your IDE isn't helping you write code, you've chosen the wrong one.

### One IDE to rule them all

> What's the best IDE? There isn't one.

You may have to switch IDEs based on what language you are currently writing in. You may find that you don't *have to* but you may want to due to languages. Some IDEs are better or have more features for certain languages. Take, for instance, Visual Studio. There are extensions galore for web development that really make JavaScript a first-class citizen, yet when I developed in [CoffeeScript](http://coffeescript.org/) I preferred Sublime Text. One thing to keep in mind when reading on is that I will focus more on the ones I've used most. Another thing to keep in mind is that an IDE is a matter of preference.

> The key here is that you want to choose the IDE that suits ***you***. Your collegues may have different preferences and may espout their chosen IDEs features, but if it doesn't work for you then you may as well get a pipe and smack you keyboard and call it coding.

.NET IDEs
--

### Visual Studio

How can we not start here. It's the main-stay of .NET IDEs and it's what I use on a daily basis. Visual Studio comes in a variety of flavors, Express (free), Professional, Premium, and Ultimate.

The main drawback of Express is that there isn't just *one* version. There are several that all depend on what you want to do. There's one specifically for [web](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-express-web), one for [desktop](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-express-windows-desktop), one for [RT](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-express-windows-8) (interface formerly known as metro), one for [Phone](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-express-windows-phone), etc. They all have MSTest built in too so you can create unit tests. To be honest, for open source projects or single dev shops, you don't really need much more. One **major** drawback is that you can't install extensions like you can for the Pro and higher versions, which means no ReSharper.

[Professional](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-professional) is identical to the Express editions with the addition of extensions (yay [ReSharper](http://www.jetbrains.com/resharper/) support), and it's *one* version. Over the years the Professional version has become really watered down and, in my opinion, doesn't cut the mustard for large projects anymore.

Which brings us to [Premium](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-premium). All of the versions are buy-ups so to speak, so you get all the goodies of the lower-priced versions but with added features. The biggest thing that Premium gets you is the Team tools. From here you can solicit code reviews, view your tasks for the project/sprint, perform code reviews for others, etc. When I say solicit code reviews, I don't just mean create a task, I mean full-featured reviews. You can create a task for someone and they can open that task and see all of the files you changed and do a side-by-side comparison of the changes. You even get to highlight and comment the changed code and send those comments back. When you get the comments you can click on them and it will jump you right to the line under discussion. Really cool feature and essential for larger teams.

Last is [Ultimate](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-ultimate). Which has all of the features. The two big draws here are the Architecture tools and the Load and Performance test tools. In earlier versions of VS you could perform Load and Performance tests at the Premium SKU, but as of 2012 that has changed. If you're on a larger team/project, I recommend that at least one person have one of these licenses.

### Alternative .NET IDEs

Alternatives are [SharpDevelop](http://www.icsharpcode.net/OpenSource/SD/), which I haven't used but I hear is a very nice alternative to VS. Another one is [MonoDevelop](http://monodevelop.com/), which if you're doing development in Mono instead of C#, you have a choice of VS or MD, but MD is really nice at it. If JetBrains were to create an IDE for .NET and package ReSharper into it, I have a feeling that would become dominant (*hint hint JetBrains :-)*).

JavaScript IDEs
--

### [WebMatrix](http://www.microsoft.com/web/webmatrix/)

This is a really nice free offering from Microsoft. If you're a .NET developer making a transition to Node.js or just don't want to load Visual Studio, this is a really great stepping stone. It has default templates for .NET Web Projects and Node.js projects among many others. It will also automatically configure your IISExpress to run Node.js websites. You can even install a NPM extension that lets you grab packages right from the IDE.

### [WebStorm](http://www.jetbrains.com/webstorm/)

This one is by JetBrains and is a world class web IDE. It's biggest draws are going to be the intellisense (code completion) and refactoring tools. It's a really nice IDE and feels very comfortable to work in. You can **try before you buy** and can pick up a personal license for $49 (USD).

### [Sublime Text](http://www.sublimetext.com/)

This one is my personal favorite. It's comparable to TextMate if you're familiar with it. It can even use TextMate packages. It has word completion instead of code completion out of the box so you'll have to be aware of that going in. You can enable [VIM-mode](http://www.sublimetext.com/docs/3/vintage.html) out of the box too (this may not be for everyone, but my beard demands it). The thing that really sells Sublime Text for me is the packages and a package called [Package Control](https://sublime.wbond.net/installation). It makes installing packages a few keystrokes away. There is a rich community developing packages for Sublime Text and you could even create your own. Want JavaScript Snippets? It's there. What Express.js Snippets? They're there too. How about jsLint or jsHint? Yup. You can make it be as robust as all the other IDEs or as simple as notepad. It's completely up to you. After using it for CoffeeScript, JavaScript, and as my primary Node.js IDE it makes Visual Studio feel like an 80-tool swiss army knife (nice, but unweildy). You can **try before you buy** and can pick up a personal license for $70 (USD).

> No matter what IDE you choose, make sure you learn the ins and outs of it. There are things that an IDE can do to make your life so much easier when coding. Don't ignore those things and make sure you fully explore. Happy Coding!