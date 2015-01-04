---
layout: post
title:  "Enhancing Sublime Text Context Menus on Windows"
date:   2015-01-04 11:08:59 -0700
tags:
    - windows
    - Sublime Text
    - Context Menu
    - Right Click
    - Open Directory
    - Open Folder
disqus_id: 11
---

**[Sublime Text](http://http://www.sublimetext.com/)**
=

It's a great code editor. It can be an IDE if you want it to be, but at it's heart it's a highly extensible text editor. I love it! You can even get intellisense for C# now if you visit [OmniSharp.net](http://omnisharp.net) and follow the steps to install. I'll do some more blogs on how I have my Sublime Text set up and one to set up OmniSharp. This is really just some quick enhancements to make a great product a little better. By the way, Sublime Text is free with some nag-ware. I highly reccomend you pay for it and support the team, I did and it was well worth it.

### Enhancing the Context Menu

Sublime Text, by default, will give you the option to add _Open with Sublime Text_ to the context menu when right-clicking _any_ file. This is great and I use it a lot, make sure you've selected it during the install before starting this.

One thing that I have trouble with is that I do have other context menu enhancements and the _Open with Sublime Text_ doesn't always jump out at me. So one thing we're going to do is add the Sublime Text icon to the existing context menu option. The other thing we're going to do is add an **_Open Directory with Sublime Text_** action to the context menu when we right-click on a directory. All it takes is creating a .reg file to update your registry.

#### 1\. Create a file on your desktop

1. Right-click on the desktop
1. Click New > Text Document
1. Name it "SublimeContext.reg" make sure to drop the .txt extension

#### 2\. Open in Notepad (or Sublime Text)

1. Make note of your installation directory of Sublime Text. I'm running Windows 8.1 with Sublime Text 3 in the default location. so for me, it is `C:\Program Files\Sublime Text 3\sublime_text.exe`
1. If your's is the same, no need to do anything, otherwise you'll have to edit the block below with your default installation.
1. Copy and paste the following block into your file.

    ```
    Windows Registry Editor Version 5.00

    [HKEY_CLASSES_ROOT\*\shell\Open with Sublime Text]
    "Icon"="C:\\Program Files\\Sublime Text 3\\sublime_text.exe"
    [HKEY_CLASSES_ROOT\*\shell\Open with Sublime Text\command]
    @="C:\\Program Files\\Sublime Text 3\\sublime_text.exe \"%1\""

    [HKEY_CLASSES_ROOT\Directory\Background\shell\Sublime Text]
    @="Open Directory with Sublime Text"
    "Icon"="C:\\Program Files\\Sublime Text 3\\sublime_text.exe"
    [HKEY_CLASSES_ROOT\Directory\Background\shell\Sublime Text\command]
    @="C:\\Program Files\\Sublime Text 3\\sublime_text.exe \"%V\""

    [HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\Sublime Text]
    @="Open Directory with Sublime Text"
    "Icon"="C:\\Program Files\\Sublime Text 3\\sublime_text.exe"
    [HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\Sublime Text\command]
    @="C:\\Program Files\\Sublime Text 3\\sublime_text.exe \"%V\""
    ```

1. Save and close your file.
1. Double-click on it and say yes, you want to add it to the registry.

#### What's it doing?

I know I'm suspicious of modifying the registry, so let's walk through each line.

```
[HKEY_CLASSES_ROOT\*\shell\Open with Sublime Text]
"Icon"="C:\\Program Files\\Sublime Text 3\\sublime_text.exe"
[HKEY_CLASSES_ROOT\*\shell\Open with Sublime Text\command]
@="C:\\Program Files\\Sublime Text 3\\sublime_text.exe \"%1\""
```

These two are merely updating an existing key. The first `HKEY` is ensuring that you have the _Open with Sublime Text_ context menu. The `Icon` `String Value` is a new one we're adding. It's simply adding the Sublime Text icon to the context menu. The second `HKEY` was an existing key that executes the command of opening the file you right-click in Sublime Text.

```
[HKEY_CLASSES_ROOT\Directory\Background\shell\Sublime Text]
@="Open Directory with Sublime Text"
"Icon"="C:\\Program Files\\Sublime Text 3\\sublime_text.exe"
[HKEY_CLASSES_ROOT\Directory\Background\shell\Sublime Text\command]
@="C:\\Program Files\\Sublime Text 3\\sublime_text.exe \"%V\""
```

These two add the new Open Directory with Sublime Text to the background context menu, we'll cover each line specifically below which adds to the right-click context menu in the same way.

```
[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\Sublime Text]
@="Open Directory with Sublime Text"
"Icon"="C:\\Program Files\\Sublime Text 3\\sublime_text.exe"
[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\Sublime Text\command]
@="C:\\Program Files\\Sublime Text 3\\sublime_text.exe \"%V\""
```

These two are completely new. This is what adds _Open Directory with Sublime Text_ to the right-click context menu. The first `HKEY` adds the text to the context menu and the Icon. The second `HKEY` adds the command of opening the directory you right-clicked in Sublime Text.

It's not much, but it adds a nice little touch to an amazing product. Have fun with it!