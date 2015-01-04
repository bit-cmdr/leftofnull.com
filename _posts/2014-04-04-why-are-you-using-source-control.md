---
layout: post
title: "Why are you using source control?"
date: 2014-04-04 11:08:59 -0700
tags:
    - Development
    - Source Control
disqus_id: 7
---

Top Reasons
=

#### 1. Save code other than on a local drive

#### 2. Share code among teams

#### 3. Version Control

Everyone that uses source control will list these reasons. I list all these reasons. They're all perfectly accurate too, butare you *really* using it for all three reasons?

### Save code other than on a local drive

Of course you do this, if you're using any kind of source control server you can't get away from it. This is, after all, one of the prime selling points to business if they don't understand why you need it. All you have to do is explain that if you don't do this all of the code could be lost in the blink of an eye. You're laptop or computer could get stolen, you're hard drive could fail, you could get hit by a bus... The list goes on, but I'm sure you're well familiar with it.

### Share code among teams

Again, if you're on a team you most likely are already doing this. Unless you're emailing eachother the zipped up source code or all working on a network share. ::shudder::

### Version Control

> ...

Here's where it gets interesting. Are you really taking advantage of the version control capabilities of your source control provider? Every change you commit is stored in the history. To truly realize this functionality you should be committing as often as possible. Depending on your version control system, this doesn't always mean pushing it to the source control server, but creating a bookmark for yourself. More of a personal stash that's stored locally or on a server.

Far too often I encounter a file/module/component with the suffix V2 with no good reason. There are always exceptions to this, so if you encounter a V2 or Vn don't fly off the handle until you're sure previous versions truly aren't needed... *then* fly off the handle. ;)

See if you are concerned about rolling back or commenting out old code, please don't. This is exactly one of the reasons that version control exists in the first place.