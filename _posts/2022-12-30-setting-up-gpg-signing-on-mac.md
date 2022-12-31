---
layout: post
title: "Setting up GPG signing on Mac"
author: alexander
tags:
  - Mac
  - GPG
image: assets/images/terminal.jpg
categories:
  - Tools
---

# Setting up GPG signing on Mac

The first question you might ask is why would I want to do this? Well, if you're using git and you want to sign your commits, you'll need to set up GPG signing. This is a great way to verify that the commits you're making are coming from you. You can also use this to sign your tags. Some projects require this to prevent malicious code from being added to the project.

Another reason that may not be obvious is that GPG signing can be admissible in court to help prove that you are the author of a commit. This is a great way to protect yourself if you're ever in a situation where you need to prove that you wrote a piece of code _and_ which machine it came from. Mind you that GPG signing alone may not be enough to prove your case, but it is a great start. One situation that may arise in your career is if you come up with an amazing idea on your own and it takes off, some companies may try to claim their employees work as their own. As long as you didn't do anything on company time and you didn't use company hardware, GPG signing can help prove that you used your own hardware to write the code.

So how difficult is it? Not at all, but there are some quirks to be aware of with macOS.

## Pre-requisites

We'll need to make sure that the macOS dev tools are installed with

```bash
xcode-select --install
```

You'll also want to install [homebrew](https://brew.sh/).

## Installing GPG

Start by downloading and installing [GPG Suite](https://gpgtools.org/);

Once installed, open up GPG Keychain. You'll want to create a new key here. Make sure that the email you use it the same as what you use for git.

To check what email you're using for git, run

```bash
git config --global -e
```

Find the `[user]` section and make a note of the `email`. This is the one you'll want to use for your GPG key. If you don't, then you'll get issues trying to submit your signed commits.

Click on the advanced area on the new key creation modal and make sure that the key type is `RSA and RSA (default)` and the key size is `4096 bits`. This is recommended by GitHub. You can also change the expiration date if you want, but I'd recommend leaving it as is.

Once you've created the key, you'll get prompted if you want to publish it to a Key Server. This is entirely up to you. I prefer to publish mine, but you don't have to, GitHub doesn't require it to be published.

### macOS Quirk

Install `gpg` with homebrew

```bash
brew install gpg
```

For macOS you'll also want to install `pinentry-mac`

```bash
brew install pinentry-mac
```

check the install path for `pinentry-mac` with

```bash
which pinentry-mac
```

copy the output of that command and we'll use it to update the gpg-agent config file.

Open up `~/.gnupg/gpg-agent.conf` with your favorite editor, I like vim, and add the following line

```bash
pinentry-program <path you copied from the "which pinentry-mac">
```

mine looks like this

```bash
pinentry-program /opt/homebrew/bin/pinentry-mac
```

Save the file and rune `killall gpg-agent` to restart the gpg-agent.

Let's test that everything is working by running

```bash
echo "test" | gpg --clearsign
```

You should see something like this

```bash
gpg: using "<your long-form key id>" as default secret key for signing
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

test
-----BEGIN PGP SIGNATURE-----

lots of characters representing your signature here
-----END PGP SIGNATURE-----
```

## Configuring git

You're almost there! Now we just need to configure git to use GPG signing. Let's start by adding your GPG key to GitHub. Go to `Settings > SSH and GPG keys`, scroll down to the GPG keys section and click `New GPG key`. In the title put something that will help you identify the key, I usually use a description of the machine it's for. In the `Key` field you'll need to paste your public key block. You can get this by running an export.

You'll need a bit of information first. You can find your key id by running

```bash
gpg --list-secret-keys --keyid-format LONG
```

You'll want to use the id that starts with `rsa4096/` for the `sec` section, just copy the string after the `rsa4096/` part, don't include the `rsa4096/` part.

```bash
gpg --armor --export <your key id>
```

The output of this is your public key block. Copy this into the `Key` field on GitHub. Include the `-----BEGIN PGP PUBLIC KEY BLOCK-----` and `-----END PGP PUBLIC KEY BLOCK-----` in what you paste into GitHub. Click `Add GPG key`.

We're almost done, I promise! You'll want to automate this with `git` so you don't forget to sign your commits. Start by opening the global git config file with

```bash
git config --global -e
```

find the `[user]` section and add a new key called `signingkey = <your key id>`. Scroll down a bit and add the following lines

```bash
[commit]
  gpgsign = true
```

This allows you to sign all you commits by default. If you don't want to sign _all_ your commits, you can leave out the changes to the `[commit]` section and just sign the commits you want to sign with `git commit -S`.

That's it! You're all set up and ready to roll with GPG signed commits. Enjoy!
