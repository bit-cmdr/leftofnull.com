---
layout: post
title: "Installing Neovim with LazyVim (and the Config I'm Currently Using)"
author: alexander
tags:
  - Development
  - Coding
  - Neovim
  - LazyVim
  - Tools
image: assets/images/terminal.jpg
featured: true
categories:
  - Development
  - Tools
---

There's something satisfying about owning your editor. I've worked in Visual Studio, Sublime Text, VS Code, Cursor, and a handful of others over the years, and they're all great in their own way. But lately they've been getting overly bloated and slower from great features that just don't apply to me. Neovim with [LazyVim](https://www.lazyvim.org/){:target="\_blank" rel="noopener noreferrer"} on top of it is the compromise I've landed on. You get a fast, modal editor with sane defaults, LSP, treesitter, completion, formatters, and a plugin manager out of the box — plus everything is just Lua sitting in `~/.config/nvim` that you can read and change and configure to your hearts content.

This post walks through installing Neovim, getting LazyVim set up, and then dropping in the same config I use day-to-day. If you're new to Neovim you can stop after the LazyVim section and you'll have a perfectly usable editor. Everything after that is just tuning.

Let's get into it.

## Prerequisites

- A working terminal. I use [Ghostty](https://ghostty.org/){:target="\_blank" rel="noopener noreferrer"} on macOS, but anything modern with truecolor support is fine (iTerm2, Alacritty, Wezterm, Kitty).
- A [Nerd Font](https://www.nerdfonts.com/){:target="\_blank" rel="noopener noreferrer"} installed and set as your terminal font. LazyVim leans on these for icons and renders weirdly without them. I use JetBrainsMono Nerd Font, but any of them will do. GitHub's Monaspace is excellent too!
- [Homebrew](https://brew.sh/){:target="\_blank" rel="noopener noreferrer"} if you're on macOS.
- `git`, `make`, and a C compiler — these usually come with the Xcode Command Line Tools (`xcode-select --install`).
- Highly recommended: [ripgrep](https://github.com/BurntSushi/ripgrep){:target="\_blank" rel="noopener noreferrer"} (`brew install ripgrep`) and [fd](https://github.com/sharkdp/fd){:target="\_blank" rel="noopener noreferrer"} (`brew install fd`). Telescope, the fuzzy finder LazyVim ships with, is much faster and smarter when these are on your `PATH`.
- Node.js, if you want the JavaScript/TypeScript LSPs to do anything useful.

## Installing Neovim

On macOS:

```sh
brew install neovim
```

On Linux, your distro probably has it, but the version is usually old. I'd recommend the official tarball or the [bob](https://github.com/MordechaiHadad/bob){:target="\_blank" rel="noopener noreferrer"} version manager if you want to keep up with releases.

Verify it works:

```sh
nvim --version
```

You'll want at least `v0.10.0` for LazyVim to be happy. I'm using 0.12 and loving it!

## Installing LazyVim

LazyVim is technically just a Neovim distribution — a curated set of plugins glued together with a starter config that you own. You don't install it like a package; you clone the starter and let it bootstrap itself.

First, if you have an existing `~/.config/nvim`, back it up:

```sh
mv ~/.config/nvim ~/.config/nvim.bak
mv ~/.local/share/nvim ~/.local/share/nvim.bak
mv ~/.local/state/nvim ~/.local/state/nvim.bak
mv ~/.cache/nvim ~/.cache/nvim.bak
```

_note: be sure to actually move them, not delete them. You'll thank yourself the first time you want to look up a setting from your old config._

Then clone the starter (don't skip this step):

```sh
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git
```

_Optionally if you don't want to read over the example_

```sh
rm -f ~/.config/plugins/example.lua
```

That's it. Launch `nvim` and `lazy.nvim` will bootstrap itself, pull down LazyVim, and install every plugin it needs. You'll see a UI come up showing progress. Let it finish, then quit and relaunch — the second start is when everything is actually wired up.

**note: the first launch will take a minute or two and look chaotic. That's normal. Don't kill it.**

## Picking your language extras

LazyVim ships with "extras" — opt-in plugin bundles for languages and tooling. You enable them in `~/.config/nvim/lazyvim.json`. You can manage them interactively with `:LazyExtras`, here's mine:

```json
{
  "extras": [
    "lazyvim.plugins.extras.lang.clojure",
    "lazyvim.plugins.extras.lang.docker",
    "lazyvim.plugins.extras.lang.dotnet",
    "lazyvim.plugins.extras.lang.go",
    "lazyvim.plugins.extras.lang.json",
    "lazyvim.plugins.extras.lang.markdown",
    "lazyvim.plugins.extras.lang.python",
    "lazyvim.plugins.extras.lang.ruby",
    "lazyvim.plugins.extras.lang.sql",
    "lazyvim.plugins.extras.lang.tailwind",
    "lazyvim.plugins.extras.lang.terraform",
    "lazyvim.plugins.extras.lang.toml",
    "lazyvim.plugins.extras.lang.typescript",
    "lazyvim.plugins.extras.lang.typescript.oxc",
    "lazyvim.plugins.extras.lang.typescript.vtsls",
    "lazyvim.plugins.extras.lang.yaml",
    "lazyvim.plugins.extras.util.gh",
    "lazyvim.plugins.extras.vscode"
  ],
  "install_version": 8,
  "version": 8
}
```

Once you're in the :LazyExtras, scroll down to the `lang.` section and hit `x` for all the ones you want.

The TypeScript story deserves a brief mention. There are three TS-related extras enabled here: the base `lang.typescript`, `lang.typescript.oxc`, and `lang.typescript.vtsls`. `vtsls` is a much faster TypeScript language server fork (a wrapper around the VS Code TS server), and `oxc` brings in the [Oxc](https://oxc.rs/){:target="\_blank" rel="noopener noreferrer"} toolchain — a Rust-based linter and formatter that's incredibly fast. I'll come back to oxc when we get to formatters.

Hit `q` to exit. Restart nvim and `:Lazy sync` will install everything for the new extras.

## Custom options

Now we get into the personal stuff. LazyVim has sensible defaults, but I want a few things tweaked. This lives in `~/.config/nvim/lua/config/options.lua`:

```lua
vim.opt.completeopt = { "noinsert", "menuone", "noselect" }
vim.opt.cursorline = true
vim.opt.hidden = true
vim.opt.autoindent = true
vim.opt.inccommand = "split"
vim.opt.mouse = "a"
vim.opt.number = true
vim.opt.splitbelow = true
vim.opt.splitright = true
vim.opt.title = true
vim.opt.wildmenu = true
vim.opt.spell = true
vim.opt.ttyfast = true
vim.opt.termguicolors = true
vim.opt.signcolumn = "yes"
vim.opt.relativenumber = false
vim.opt.tabstop = 2
vim.opt.softtabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true
vim.opt.smartindent = true
vim.opt.wrap = false
vim.opt.showmode = false
vim.opt.hlsearch = true
vim.opt.incsearch = true
vim.opt.syntax = "on"
vim.opt.wildoptions:append("pum")
```

A few of these are worth calling out:

- `inccommand = "split"` shows you a live preview of `:substitute` results in a split window as you type. Once you've used it you can't go back.
- `relativenumber = false` is intentional. I know relative line numbers are the meta — I just prefer absolute numbers. Easier to talk through code with someone over a call.
- `signcolumn = "yes"` always keeps the gutter open so it doesn't jitter when diagnostics show up.
- `spell = true` enables spell check globally. It's noisier than you'd expect at first; you'll either love it or turn it off.
- `splitbelow` / `splitright` make new splits open in the directions my brain expects.

## Keymaps

I keep custom keymaps very minimal, for now, because LazyVim's defaults are already good. This is `~/.config/nvim/lua/config/keymaps.lua`:

```lua
vim.g.mapleader = " "
vim.g.maplocalleader = "\\"
vim.keymap.set("n", "<leader>cd", vim.cmd.Ex, { desc = "Activate nvim Ex" })
```

Space as leader, backslash as local leader, and `<leader>cd` to drop into the built-in netrw file explorer. LazyVim binds `<leader>e` to the [neo-tree](https://github.com/nvim-neo-tree/neo-tree.nvim){:target="\_blank" rel="noopener noreferrer"} sidebar, but every now and then I want the plain netrw view of the current directory, so I keep that within reach.

## Autocmds

Two autocmds, both load-bearing for me. This is `~/.config/nvim/lua/config/autocmds.lua`:

{% raw %}

```lua
vim.api.nvim_create_autocmd("BufWritePre", {
  pattern = { "*.ts", "*.tsx", "*.js", "*.jsx", "*.mjs", "*.cjs", "*.md", "*.yaml" },
  callback = function()
    vim.lsp.buf.code_action({
      context = { only = { "source.fixAll.oxc" }, diagnostics = {} },
      apply = true,
    })
  end,
})

vim.api.nvim_create_autocmd({ "BufRead", "BufNewFile" }, {
  pattern = "*.html",
  callback = function(args)
    local first_lines = vim.api.nvim_buf_get_lines(args.buf, 0, 20, false)
    for _, line in ipairs(first_lines) do
      if line:match("{%%") or line:match("{{") or line:match("^%-%-%-") then
        vim.bo[args.buf].filetype = "liquid"
        return
      end
    end
  end,
})
```

{% endraw %}

The first one runs the Oxc `source.fixAll` code action on save for JS/TS/Markdown/YAML files. Combined with `oxlint` as my linter, this gives me ESLint-style auto-fixing on save without the ESLint startup cost.

The second one is more niche — I work on this Jekyll blog, and `.html` files in Jekyll are full of Liquid templating ({% raw %}`{% include %}`, `{{ variable }}`{% endraw %}, and a YAML frontmatter block at the top). Neovim's default `html` filetype gets confused by Liquid syntax, so this autocmd peeks at the first 20 lines, looks for Liquid markers or a frontmatter block, and switches the filetype to `liquid`. If you're not editing templated HTML you can drop this one.

## Theme

I want a theme that's easy on the eyes for long sessions and matches what I see in GitHub. So I use [github-nvim-theme](https://github.com/projekt0n/github-nvim-theme){:target="\_blank" rel="noopener noreferrer"} in dark mode. This lives in `~/.config/nvim/lua/plugins/themes.lua`:

```lua
return {
  {
    "projekt0n/github-nvim-theme",
    name = "github-theme",
    lazy = false,
    priority = 1000,
  },
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "github_dark",
    },
  },
}
```

The `lazy = false` and `priority = 1000` matter — you want your colorscheme to load early so you don't see a flash of the default theme on startup.

## LSP, formatters, and treesitter

Here's where you tell LazyVim about extra language servers, treesitter parsers, and formatters. This is `~/.config/nvim/lua/plugins/lsp.lua`:

```lua
return {
  {
    "nvim-treesitter/nvim-treesitter",
    opts = function(_, opts)
      vim.list_extend(opts.ensure_installed, {
        "css",
        "scss",
        "graphql",
        "embedded_template",
        "liquid",
      })
    end,
  },
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        html = {},
        cssls = {},
        bashls = {},
        graphql = {},
        oxlint = {
          settings = {
            fixKind = "all",
          },
        },
      },
    },
  },
  {
    "stevearc/conform.nvim",
    opts = {
      formatters_by_ft = {
        yaml = { "oxfmt" },
        markdown = { "oxfmt" },
        html = { "oxfmt" },
        css = { "oxfmt" },
        cssls = { "oxfmt" },
        scss = { "oxfmt" },
        less = { "oxfmt" },
        graphql = { "oxfmt" },
        mdx = { "oxfmt" },
        ruby = { "rubocop" },
      },
    },
  },
}
```

A few notes on this:

- I use `vim.list_extend` rather than just setting `ensure_installed` directly so I'm _adding_ to the LazyVim defaults rather than replacing them. The starter `example.lua` has a long comment about this exact gotcha and it's worth reading.
- `oxfmt` is the Oxc formatter. It handles most of the file types Prettier would, and it's an order of magnitude faster. For Ruby I'm still using `rubocop` because that's what works.
- `oxlint` runs as an LSP server, so you get diagnostics live in your buffer the same way you would with `tsserver`.

Mason will pull down the binaries for these the first time you open a matching file, or you can `:Mason` and install them up front.

## Markdown editing

I write blog posts (like this one) in Neovim, so I lean into Markdown editing. Two plugins make this nice. This is `~/.config/nvim/lua/plugins/markdown.lua`:

```lua
return {
  {
    "tadmccorkle/markdown.nvim",
    ft = { "markdown" },
    opts = {
      mappings = {
        inline_surround_toggle = "gs",
        inline_surround_toggle_line = "gss",
        inline_surround_delete = "ds",
        inline_surround_change = "cs",
        link_add = "gla",
        link_follow = "gx",
        go_curr_heading = "gh",
        go_parent_heading = "gp",
        go_next_heading = "gj",
        go_prev_heading = "gk",
      },
      inline_surround = {
        emphasis = { key = "i", txt = "*" },
        strong = { key = "b", txt = "**" },
        strikethrough = { key = "s", txt = "~~" },
        code = { key = "c", txt = "`" },
      },
      link = {
        paste = { enable = true },
      },
      toc = {
        omit_heading = "toc omit heading",
        omit_section = "toc omit section",
        markers = { "#", "##", "###", "####", "#####", "######" },
      },
      on_attach = function(bufnr)
        local function toggle(key)
          return "<Esc>gs" .. key .. "gv"
        end

        vim.keymap.set("x", "<C-b>", toggle("b"), { buffer = bufnr, desc = "Toggle bold" })
        vim.keymap.set("x", "<C-i>", toggle("i"), { buffer = bufnr, desc = "Toggle italic" })
      end,
    },
  },

  {
    "MeanderingProgrammer/render-markdown.nvim",
    ft = { "markdown", "markdown.mdx" },
    opts = {
      heading = {
        sign = false,
        position = "overlay",
        icons = { "󰲡 ", "󰲣 ", "󰲥 ", "󰲧 ", "󰲩 ", "󰲫 " },
      },
      code = {
        sign = false,
        width = "block",
        right_pad = 1,
        border = "thick",
      },
      bullet = {
        icons = { "●", "○", "◆", "◇" },
      },
      checkbox = {
        enabled = true,
        unchecked = { icon = "󰄱 " },
        checked = { icon = "󰱒 " },
      },
      pipe_table = {
        preset = "round",
      },
      anti_conceal = {
        enabled = true,
      },
    },
  },
}
```

[markdown.nvim](https://github.com/tadmccorkle/markdown.nvim){:target="\_blank" rel="noopener noreferrer"} gives you operations like "select a word in visual mode and press `Ctrl-B` to wrap it in bold", plus easy heading navigation. [render-markdown.nvim](https://github.com/MeanderingProgrammer/render-markdown.nvim){:target="\_blank" rel="noopener noreferrer"} draws the buffer with rendered headings, code-block boundaries, bullets, and checkboxes — it makes the editor feel like a halfway-decent Markdown preview without ever leaving the buffer.

## Git tooling

I deal with merge conflicts often enough that resolving them in raw markers via `<<<<<<<` / `=======` / `>>>>>>>` gets old fast, and I'd rather not jump out to a separate diff tool every time I want to review a change. Two plugins solve both of those for me. This is `~/.config/nvim/lua/plugins/git.lua`:

```lua
return {
  {
    "akinsho/git-conflict.nvim",
    version = "*",
    event = "BufReadPre",
    opts = {
      default_mappings = true,
      default_commands = true,
      disable_diagnostics = false,
      list_opener = "copen",
    },
  },
  {
    "sindrets/diffview.nvim",
    opts = {
      enhanced_diff_hl = true,
      view = {
        merge_tool = {
          layout = "diff3_mixed",
          disable_diagnostics = true,
        },
      },
    },
  },
}
```

[git-conflict.nvim](https://github.com/akinsho/git-conflict.nvim){:target="\_blank" rel="noopener noreferrer"} highlights conflict regions in any file that has them and binds resolution shortcuts. With `default_mappings = true` you get `co` to choose ours, `ct` to choose theirs, `cb` to choose both, and `c0` to choose none, plus `]x` / `[x` to jump between conflicts in the buffer. `default_commands = true` registers the `:GitConflict*` Ex commands, and `list_opener = "copen"` sends the "list all conflicts in the repo" command into the quickfix window where I'm already used to navigating results. I load it on `BufReadPre` so it's ready the moment a file with markers opens.

[diffview.nvim](https://github.com/sindrets/diffview.nvim){:target="\_blank" rel="noopener noreferrer"} gives you a single-tab interface for any git diff or file history. `:DiffviewOpen` shows everything changed since the last commit, `:DiffviewOpen main..HEAD` shows your branch diff against main, and `:DiffviewFileHistory %` walks the history of the current file. `enhanced_diff_hl = true` turns on the more visually distinct red/green highlighting for diff hunks. For three-way merges I set the layout to `diff3_mixed`, which puts the BASE version next to a working buffer that combines OURS and THEIRS — easier to reason about than the side-by-side OURS/THEIRS layout when a conflict isn't trivial.

## Colorizing and rainbow delimiters

Two small visual quality-of-life plugins. This is `~/.config/nvim/lua/plugins/colorizer.lua`:

```lua
return {
  {
    "NvChad/nvim-colorizer.lua",
    event = { "BufReadPre", "BufNewFile" },
    opts = {
      filetypes = {
        "*",
        "!lazy",
        "!mason",
        "!TelescopePrompt",
      },
      user_default_options = {
        RGB = true,
        RRGGBB = true,
        RRGGBBAA = true,
        AARRGGBB = false,
        rgb_fn = true,
        hsl_fn = true,
        names = false,
        css = false,
        css_fn = false,
        tailwind = true,
        sass = { enable = false, parsers = { "css" } },
        mode = "background",
        virtualtext = "■",
        always_update = false,
      },
      buftypes = {},
    },
  },
  {
    "HiPhish/rainbow-delimiters.nvim",
    event = { "BufReadPost", "BufNewFile" },
    config = function()
      require("rainbow-delimiters.setup").setup({})
    end,
  },
}
```

[nvim-colorizer](https://github.com/NvChad/nvim-colorizer.lua){:target="\_blank" rel="noopener noreferrer"} paints the background of any hex/rgb/hsl color with that actual color, so writing CSS or Tailwind class lists you can see what `#2563EB` looks like inline. [rainbow-delimiters](https://github.com/HiPhish/rainbow-delimiters.nvim){:target="\_blank" rel="noopener noreferrer"} pairs matching brackets in different colors. Both are tiny, both pay for themselves the first time you're staring at deeply nested code.

## Completion in the command line

One last tweak — by default LazyVim's `blink.cmp` completion sometimes makes arrow keys feel funny in the command line. I want `<Up>` and `<Down>` to move through completion candidates if the menu is open, and fall back to history navigation otherwise. This is `~/.config/nvim/lua/plugins/navigation.lua`:

```lua
return {
  "saghen/blink.cmp",
  opts = {
    cmdline = {
      keymap = {
        preset = "default",
        ["<Up>"] = { "select_prev", "fallback" },
        ["<Down>"] = { "select_next", "fallback" },
      },
    },
  },
}
```

Small thing, but it makes the command line feel a lot more natural.

## Where to go from here

That's the whole setup. To recap, your `~/.config/nvim` tree ends up looking like this:

```
~/.config/nvim/
├── init.lua
├── lazyvim.json
├── lua/
│   ├── config/
│   │   ├── autocmds.lua
│   │   ├── keymaps.lua
│   │   ├── lazy.lua
│   │   └── options.lua
│   └── plugins/
│       ├── colorizer.lua
│       ├── git.lua
│       ├── lsp.lua
│       ├── markdown.lua
│       ├── navigation.lua
│       └── themes.lua
└── stylua.toml
```

Every file under `lua/plugins/` gets picked up automatically. Want to add a new plugin? Drop a new file in there that returns a table (or add to an existing file if it makes sense), restart, and `:Lazy sync`. That's the whole loop.

A few things that helped me when I was getting started:

- `:checkhealth` will tell you if anything's broken or missing — run it after install and after enabling new extras.
- `<leader>?` (LazyVim default) opens a searchable cheat sheet of every keymap. Don't try to memorize the bindings up front; just keep this open until your fingers learn them.
- `:Lazy` is the plugin manager UI. `:Mason` is the LSP/formatter installer UI. Both let you see what's installed and update things.
- When something feels weird, `:Telescope keymaps` and `:Telescope highlights` are great ways to figure out what's actually configured.

---

Happy coding!
