---
layout: post
title: "Setting up the package.json for node.js. The short, short version"
date: 2014-10-28 11:08:59 -0700
tags:
    - node.js
    - node
    - package.json
    - tutorial
    - npm
    - npm install
    - npm init
disqus_id: 10
---

Package.json
=

Most tutorials start with the package.json. This is a very important step. Here's an example of a live package.json, this is Ghost v0.5's package.json:

```json
{
  "name"        : "ghost",
  "version"     : "0.5.0",
  "description" : "Just a blogging platform.",
  "author"      : "Ghost Foundation",
  "homepage"    : "http://ghost.org",
  "keywords"    : [
    "ghost",
    "blog",
    "cms"
  ],
  "repository"  : {
    "type": "git",
    "url": "git://github.com/TryGhost/Ghost.git"
  },
  "bugs"        : "https://github.com/TryGhost/Ghost/issues",
  "contributors": "https://github.com/TryGhost/Ghost/graphs/contributors",
  "licenses"    : [
    {
      "type": "MIT",
      "url": "https://raw.github.com/TryGhost/Ghost/master/LICENSE"
    }
  ],
  "main": "./core/index",
  "scripts": {
    "start": "node index",
    "test": "./node_modules/.bin/grunt validate --verbose"
  },
  "engines": {
    "node": "~0.10.0"
  },
  "engineStrict": true,
  "dependencies": {
    "bcryptjs": "0.7.10",
    "body-parser": "1.6.3",
    "bookshelf": "0.7.6",
    "busboy": "0.2.3",
    "colors": "0.6.2",
    "compression": "^1.0.2",
    "connect": "3.0.0-rc.1",
    "connect-slashes": "1.2.0",
    "cookie-parser": "1.0.1",
    "downsize": "0.0.5",
    "express": "4.8.3",
    "express-hbs": "0.7.10",
    "express-session": "1.0.4",
    "fs-extra": "0.8.1",
    "html-to-text": "^0.1.0",
    "knex": "0.6.21",
    "lodash": "2.4.1",
    "moment": "2.4.0",
    "morgan": "1.0.0",
    "node-polyglot": "0.3.0",
    "node-uuid": "1.4.1",
    "nodemailer": "0.5.13",
    "oauth2orize": "1.0.1",
    "passport": "0.2.0",
    "passport-http-bearer": "1.0.1",
    "passport-oauth2-client-password": "0.1.1",
    "rss": "0.2.1",
    "semver": "2.2.1",
    "showdown": "https://github.com/ErisDS/showdown/archive/v0.3.2-ghost.tar.gz",
    "sqlite3": "2.2.3",
    "static-favicon": "1.0.2",
    "unidecode": "0.1.3",
    "validator": "3.4.0",
    "when": "3.2.3",
    "xml": "0.0.12"
  },
  "optionalDependencies": {
    "mysql": "2.1.1"
  },
  "devDependencies": {
    "blanket": "~1.1.5",
    "bower": "~1.3.5",
    "grunt": "~0.4.1",
    "grunt-cli": "~0.1.13",
    "grunt-concat-sourcemap": "~0.4.3",
    "grunt-contrib-clean": "~0.5.0",
    "grunt-contrib-compress": "~0.5.2",
    "grunt-contrib-concat": "~0.4.0",
    "grunt-contrib-copy": "~0.4.1",
    "grunt-contrib-jshint": "~0.8.0",
    "grunt-contrib-uglify": "~0.5.0",
    "grunt-contrib-watch": "~0.5.3",
    "grunt-docker": "~0.0.8",
    "grunt-ember-templates": "~0.4.18",
    "grunt-es6-module-transpiler": "~0.6.0",
    "grunt-express-server": "~0.4.11",
    "grunt-mocha-cli": "~1.4.0",
    "grunt-shell": "~0.7.0",
    "grunt-update-submodules": "~0.4.0",
    "matchdep": "~0.3.0",
    "mocha": "~1.15.1",
    "nock": "0.27.2",
    "rewire": "~2.0.0",
    "request": "~2.29.0",
    "require-dir": "~0.1.0",
    "should": "~2.1.1",
    "sinon": "~1.7.3",
    "supertest": "~0.8.2"
  }
}
```

Notice the `dependencies`, `optionalDependencies`, and `devDependencies` sections. These list the referenced packages that are required for the system to work. When you clone Ghost you can run `~/ghost $ npm install` from inside the Ghost directory and all the dependent packages will be retrived. If you're a .NET developer, you can think of these as References, or better yet, NuGet packages with the "auto-download missing packages" feature enabled.

The scripts section allow you to run the application by aliasing `~/ghost $ node index` for `~/ghost $ npm start`. Additionally you can run the test suite by using `~/ghost $ npm test`. `npm` "understands" these as default scripts. So what makes this the short, short version?

### Rapid setup

Don't bother with trying to create the package.json yourself. You can tweak it by hand for sure, but there are much simpler ways to create it. Ways like this:

```sh
$ mkdir myProj
$ cd myProj
$ npm init
```

**`npm init`** is a tool that will walk you through creating a package.json via a cli wizard. Just answer the questions it asks you like this:

```sh
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sane defaults.

See 'npm help json' for definitive documentation on these fields
and exactly what they do.

Use 'npm install <pkg> --save' afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
name: (myProj) MyProj
version: (1.0.0) 0.0.1
description: Sample npm init
entry point: (index.js) app.js
test command:
git repository: <git repo url (if applicable)>
keywords: npm, node, tutorial, package.json
author: Alexander Kahoun
license: (ISC) MIT
{
  "name": "MyProj",
  "version": "0.0.1",
  "description": "Sample npm init",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "<git repo url (if applicable)>"
  },
  "keywords": [
    "npm",
    "node",
    "tutorial",
    "package.json"
  ],
  "author": "Alexander Kahoun",
  "license": "MIT"
}


Is this ok? (yes) yes
```

Now you have a package.json all ready to go. Another cool tip, you can auto-save dependencies to your package.json as you go. All you need to do is add a flag to your `npm install <packageName>` command. For instance:
`~/myProj $ npm install mongoose --save`
will both install mongoose into your myProj directory *and* it will add the following to your package.json:

```json
"dependencies": {
  "mongoose": "^3.8.18"
}
```

Alternatively `npm install mongoose --save-dev` or `npm install mongoose --save-optional` will install the packages just the same, but put them into your package.json in the `devDependencies` section or `optionalDependencies` sections respectively.

### Tl;dr

#### Too long; didn't read

Make sure you use `npm init` and `npm install <package> --save` for quick setup of a project:

```sh
$ mkdir myProj
$ cd myProj
$ npm init
```

Answer the questions it asks you, don't be afraid to leave them blank if you don't know.

```sh
$ npm install <package> --save
```

Repeat as necessary.

### Gotcha's

You may want to be careful with some of the packages. Some packages like express.js are great for rapid setup, but when you run the `express` command to set up your project, it *will* overwrite any existing package.json. So if you have a package that sets up your package.json for you, make sure to install your dependencies *after* you run the command.

#### Happy coding!
