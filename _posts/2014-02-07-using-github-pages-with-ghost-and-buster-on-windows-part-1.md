---
layout: post
title: "Using GitHub Pages with Ghost and Buster on Windows (part 1)"
date: 2014-02-07 11:08:59 -0700
tags: 
    - ghost
    - windows
    - github pages
    - buster
    - gh-pages
    - blog
    - node.js
disqus_id: 4
---

Taking Inventory and Setting Up
=

> First and foremost, if you are using Linux or OSX, follow this guide [here](http://genescissors.github.io/deploying-ghost-blog-to-gh-pages/) and save yourself a **lot** of time.

**Series:**

- Part 1: Taking Inventory and Setting Up
- [Part 2: Hacking Buster and Deploying](/2014/02/24/using-github-pages-with-ghost-and-buster-on-windows-part-2)

## List of software

I'm assuming you have a GitHub account already, if not go [create one](http://github.com) now. I'll wait.

- [node.js windows installer](http://nodejs.org/download/)
- [Git Bash windows installer](http://msysgit.github.io/)
- [MinGW](http://sourceforge.net/projects/mingw/files/latest/download?source=files) (or Cygwin, I use MinGW for this post)
- [Python 2.7 windows installer](http://www.python.org/download/) **(any version >= 3 won't work)**
- [PIP for Python](https://raw.github.com/pypa/pip/master/contrib/get-pip.py) (right click and file>save as "get-pip.py")

## Installing node.js

[node.js download](http://nodejs.org/download/)

Installing node.js on Windows is really straight forward and very easy thanks to Joyent's installer.  It truly is just a next, next, finish install. The one thing to watch out for is to make sure that you can access node and npm after the install. You may have to reboot for it to take full effect.

Let's make sure node is installed properly. Open a console and type in:

```sh
node --version
```

If it's installed properly, you should get a response like this:
`v0.10.25` keep in mind your version may be different from when this article was written.

Now let's make sure NPM is installed correctly:

```sh
npm --version
```

Expect similar output as the first statement, but the versions won't match and they aren't meant to either. If you're having any trouble, try rebooting and repeating these steps first.

## Installing Git Bash

[Git Bash download](http://msysgit.github.io/)

The installation of the Git Bash in Windows is done equally as well. It's another next, next, finish. There are some extra options that display during the install, but as long as you stick with all the defaults, i.e. don't change anything, you'll be fine.

## Installing MinGW

[MinGW download](http://sourceforge.net/projects/mingw/files/latest/download?source=files)

Here's where we start to get a little more difficult. Follow the prompts and leave the default settings. Feel free to change the install directory, in fact it's very important that you keep track of it. For this reason, I installed it to `C:\dev\MinGW`. This will come into play as we install Python and when we modify our `PATH`. Once you have it installed, you'll want to set up the packages that we'll be using. Let's launch the MinGW Installation Manager.

Select the **Basic Setup** from the menu on the left. We just need to make sure we have two packages here, `mingw32-base` and `msys-base`. It should look like this.

![ming settings 1](https://hhmoww.bn1304.livefilestore.com/y4mDpImDFvFe97dQQE4Gd8kd8itSTxXFpJvpVe5i-haGucCH7z2OKu4OHqaGYhLkyOzXRgTO3VsP4ldME5Q3RVedbwBxRs_XqvXGD6rddJR3gfKXg-soRH8iIrZaWC8ci8GJK5-m4elsMHwe6QMetYtu7qieA63LYcwRR9D1oKboZ_tbr2iW_p1d9ElQ1cYtO06nNCL5d_R5T9TStCWcCmi7A){:class="img-responsive"}

Now let's get one other package we'll need. Click on the **All Packages** and scroll down to find msys-wget and set that package to install. Lastly click the *Installation* menu at the top and then *Apply Changes*. When you're done it should look like this.

![ming settings 2](https://hxmoww.bn1304.livefilestore.com/y4mdPw4y1s7-vq_PQijvWloWjvnbPLqkJvBUBU170Cs7v3M7cNSJvPYjlpABL0-kL19X_gC2udaojpx2eSGAc63EMFhJj_TEKg5q7mN6Iymsy5sn-A0-0BIblgN-UQpzuDAuCAauNXFd5L-N5itUAjCWEhFspILiDtnCE-LPs-PfUw_U4xfcdNnN9iGEm67Sq3L9n0V3OMght3iNsqzLUGhyA){:class="img-responsive"}

As a final touch we're going to have to modify our `PATH` environment variable.

Modifying your `PATH`
-

Use the `[Windows Key] + [Pause/Break Key]` to launch your System Properties dialog. From here you'll want to click on the *Advanced System settings*. As soon as that dialog launches, click on the *Environment Variables...* button at the bottom.

![path settings](https://ibmoww.bn1304.livefilestore.com/y4ma4qsHN-zGPd3Uig56HQF9nmEyFwUyKBElbj0Zx7a7nvOycO0FUz788Vrse1FRgVLsATLBCXUVBJ1J9YHBVwpGdtjL-kkB22B4uzUUEsTb-8AIhjXrBRh4Xi4GuQ15sgQIiB2-nykR25NU9yPOaixepuiNBr_C3LWRhJNWu0AHSJ-PMKnTx3IhtqWVW4NGnSUamGNk3nHeprW1lYtwa910g){:class="img-responsive"}

Select the `PATH` variable and click *Edit*. All the values are semi-colon delimited. We'll need to add two new ones. Move to the end of the line of values and now make sure you add to following so the end looks like this:

```
;C:\dev\MINGW\msys\1.0\Bin;C:\dev\MINGW\Bin;
```

This will add all the msys tools and the mingw tools to your path so you can access them from any command prompt in Windows.

## Installing Python

[Python 2.7 download](http://www.python.org/download/)

Make sure you grab the 2.7.6 version or earlier. 3.0 or higher will not work right now. The author of buster is using the `print` statement throughout the package and in version 3 they changed it to a method call `print()`.

Here I changed the installation directory to `C:\dev\Python27` to keep all the libraries in the same root folder.

Once complete we'll need to modify the `PATH` again. Make sure you add the following to the end of the `PATH` values:

```
;C:\dev\Python27;C:\dev\Python27\scripts;
```

This will add Python and any scripts you install to the `PATH` so they can be called from any command prompt in Windows.

**Let's test it!**

Launch your Git Bash, or preferred command prompt. Type in the following command and if you get a version number back, you're good!

```sh
python --version
```

## Installing PIP

[PIP download](https://raw.github.com/pypa/pip/master/contrib/get-pip.py)

Don't get scared when you click on that link, it's supposed to look like that. Just right click anywhere on that page and select *Save As...*. Make sure to name the file `get-pip.py`. I would suggest saving it to the `C:\dev` folder to make it easy.

Once that's done, let's launch Git Bash and type in the following commands:

```sh
$ cd /c/dev
$ python get-pip.py
```

You'll see it install PIP. Now to test it out. If you get a version number, you're good!

```sh
pip --version
```

## Setup Complete!

You're now ready to move on to the next part which will be getting Ghost and buster running.