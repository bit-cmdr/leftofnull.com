---
layout: post
title: "Using GitHub Pages with Ghost and Buster on Windows (part 2)"
date: 2014-02-24 11:08:59 -0700
tags:
    - blog
    - buster
    - gh-pages
    - windows
    - ghost
    - node.js
    - github pages
disqus_id: 2
---

Hacking Buster and Deploying
=

**Series:**

- [Part 1: Taking Inventory and Setting Up](/2014/02/07/using-github-pages-with-ghost-and-buster-on-windows-part-1)<br/>
- Part 2: Hacking Buster and Deploying

## Recap

In the first part of the series we talked about setting up your Windows machine with Node.js, Python, MinGW, Git Bash, and Pip. If you haven't done so already, please use the link to part one above.

## Getting Ghost

Let's get start on getting you set up with the Ghost blogging engine. You should start by heading over to the [Ghost GitHub Repository](https://github.com/tryghost/Ghost). The README has a lot of great info in it and goes over various ways to install. We'll cover cloning the repo so you can run it locally. Let's start by firing up your Git Bash and entering the following:

```sh
$ cd ~
```

This assumes that you want to run everything in your users directory, if not change to a path where you want to install ghost. Now we'll clone ghost.

```sh
$ git clone https://github.com/TryGhost/Ghost.git
$ cd ghost
$ npm install --production
$ npm start
```

You should have Ghost running on the default url `http://127.0.0.1:2368`. You can start to create an admin profile and access the admin settings any time at `http://127.0.0.1:2368/ghost`. Now if you want to set a specific URL for your GitHub Page let's set that repo up on GitHub first. Go ahead and hit `Ctrl+C` in your Git Bash.

## Setting up your GitHub repo for GitHub pages

The best info, as always, can be found from GitHub themselves at [GitHub Pages](http://pages.github.com/). As a quick abbreviated version, we'll set up a new repo for this exercise. Go to your GitHub account and create a new repo.

![github profile](https://hygtqg.bn1304.livefilestore.com/y4mcUMRycRr5WNn0tbrst8Rdt_2GUU8fqrjrJNiaKvD6nj2dP-RG_swQWgLXhfd3qhukbeJv3gMLSOw3smH9qkEn-z4coHDUgCcm5QzrWWD7NxeP2BNXVbqe--oArlyyyyVXCK89dC3zJx3Au5PCSMcluaZt5siK5-sGN8-8idRQL-b3PH73CczxFTKHapb60C15TPYkMaDKGg0JewHPEQxvg){:class="img-responsive"}

Name the new repo whatever makes sense to you. Make sure to select Initialize with README. It's not necessary but it makes the next step that much quicker. Now in your new repo, create a new branch called `gh-pages`. It's very important that it be exact, this is what GitHub Pages works on.

![github branches](https://h4gtqg.bn1304.livefilestore.com/y4mQHC-kajvDNrte1s2EhB9pbUHSniXOBnFbwz9Ei3XvhYGoUrNeTVpIof4Zos2YT19q_IlhAlxgnlFz-6EcYpGjeIsmfL_E6lFh19AlALsDr_PoY6FnzqxIOy3qwRA0TBKMoPiLgru5MQjRbHjGD2YLFWGW2BElPP1ONxRdFU8fOnzpKlADAYoeBl0tHybwU7dhIIWhCaarcK-yNP4PJgLQQ){:class="img-responsive"}

When you're finished it should look like this:

![github gh-pages branch](https://iigtqg.bn1304.livefilestore.com/y4m8BoYzWsO0kov9s3bKFzEmzODdG-FWcxI8MHpGOAHS2HSmcF0ZwGu78utGH5PYi5p8Q5TCNoo9bZ68WqYhcsHJYyTkO3gAIDIuxMuj7QtuEawniB6CUHijWPv3rrKibMWfnLCpEQytQyMAPBC99703AAQTBMOzj-QzlJ1LwwCmIO0yipsh11jefKCgdr-hvGsmdGmVf938NywSUI8m9GBuA){:class="img-responsive"}

### Setting up your new site in git locally

Now that you have the repo set up, let's pull it down. There should be a link in the bottom right of your repo page on GitHub that looks like this:

![github clone](https://gygtqg.bn1304.livefilestore.com/y4mGGqx9rvQZ7dtZKVQSrx4d2BSV_1jyRKEiDdvalHiRQMpZ9C-jjIZz6lv_0vZS0AsatD0-GiytGo5jif0lqbV6P1zu-33GPDAuILzlJkqToMOb2kkUB_w8NyKQxUZwMhyMUQ-G0RBPBD8QnRi00H3J4tgl5Mt7JmaxizUlfrva5eR0aRVBczxjOqNm825kI4LFA1nCiqdVSPVcaiHb465PQ){:class="img-responsive"}

Click the "copy to clipboard button to grab the clone url"
Fire up your Git Bash again and use the following commands:

```sh
$ cd ~
$ git clone https://github.com/leftofnull/mywebsite.git <this will be the url you copied, not this exact one>
$ git checkout -b gh-pages
```

You should now have your repo set up!

## Modifying the default URL in Ghost

Make sure Ghost is not running. Navigate in the file explorer to where you cloned Ghost and look for `config.js`. Open it any any text editor and find the `url:` property and change it to http://*username*.github.io/*repository*.

## Hacking Buster

Unfortunately for Windows users Buster was not designed with Windows in mind. So we'll have to do a little hacking. I have a forked version of the Buster repo that can be cloned here:

```sh
$ cd ~
$ git clone https://github.com/leftofnull/buster.git
$ cd buster
```

The original repo can be found at https://github.com/axitkhurana/buster. The main differences are in the `buster/buster.py` file.

Starting at line 39, original:

```python
if arguments['generate']:
    command = ("wget \\"
               "--recursive \\"
               "--convert-links \\"
               "--page-requisites \\"
               "--no-parent \\"
               "--directory-prefix {1} \\"
               "--no-host-directories \\"
               "{0}").format(arguments['--domain'], static_path)
```

And the modified version:

```python
if arguments['generate']:
    command = ("wget "
               "--recursive "
               "--convert-links "
               "--page-requisites "
               "--no-parent "
               "--directory-prefix {1} "
               "--no-host-directories "
               "--restrict-file-names=unix "
               "{0}").format(arguments['--domain'], static_path)
```

We've removed the `\\` characters as they cause Windows to escape the string, in *nix based systems it allows you to use a carriage return and keep typing the same command. We've also added the `--restrict-file-names=unix` flag which will prevent some of the default escaping in html files that Windows performs with `wget`. This also negates the `--convert-links` flag unfortunately, we'll fix that in a minute.

Next on line 50, original:

```python
file_regex = re.compile(r'.*?(\?.*)')
```

We'll need to modify and add another regex:

```python
file_regex = re.compile(r".*?(@.*)")
html_regex = re.compile(r".*?(\.html)")
```

We have to modify the file_regex for Windows and we're going to create another to identify html files.

At line 52 in the original:

```python
for filename in filenames:
    if file_regex.match(filename):
        newname = re.sub(r'\?.*', '', filename)
        print "Rename", filename, "=>", newname
        os.rename(os.path.join(root, filename), os.path.join(root, newname))
```

We'll tweak to:

```python
for filename in filenames:
    if html_regex.match(filename):
        path = ("{0}").format(os.path.join(root, filename).replace("\\", "/"))
        with open(path, "r+") as f:
            file_contents = f.read()
            file_contents = file_contents.replace(arguments['--domain'], "")
            file_contents = file_contents.replace("%hurl", arguments['--domain'])
            f.seek(0)
            f.write(file_contents)
            f.close()
    if file_regex.match(filename):
        newname = re.sub(r'@.*', '', filename)
        print "Rename", filename, "=>", newname
        os.rename(os.path.join(root, filename), os.path.join(root, newname))
```

Here's our big cheat. We're going through all html files and swapping out any instances of the root url, in this case http://127.0.0.1:2368 or where ever you're running it locally and replacing it with a relative url path. **Hacking Complete!** As you can imagine, this has some built in performance degradation, but it works!

## Installing your modified Buster

Open your Git Bash, if you haven't already, and use the following commands:

```sh
$ cd ~
$ cd buster
$ python setup.py install
$ buster --version
0.1.2
```

That's it!

## Setting up Buster

Run the setup and when it asks for your GitHub url, use the one you will be using for your gh-pages that you set up earlier. If you need to, grab the clone url again before you start.

```sh
$ buster setup
```

And follow the prompts.

Now you'll need to open another instance of Git Bash and run:

```sh
$ cd ~
$ cd ghost
$ npm start
```

If you didn't finish setting up the admin stuff before, you'll need to set it up now. You should have the welcome post by default, we'll leave that for now so we can test it out. Once that's finished, leave Ghost running and switch back to the Git Bash where you ran the setup for Buster from. 

```sh
$ buster generate --domain=%hurl% --dir=/c/users/username/mywebsite
$ buster deploy --dir=/c/users/username/mywebsite
```

This will generate the static content and deploy your site to the gh-pages branch in GitHub. You can try navigating there by putting the http://*username*.github.io/*repository* in the location bar of any browser window.

That's it! You now have a blog on GitHub Pages with Ghost and Buster. Any time you want to add new blogs or modify it, just run ghost locally, make the changes, and run the buster generate and deploy commands. Let me know in the comments if you run into any issues. Happy Coding!