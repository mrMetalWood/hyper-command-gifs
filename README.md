# Hyper Command Gifs

Plugin for Hyper™ terminal.

Enhances your daily terminal routine with gifs. Because why not.

Currently the plugin only matches for `push` (e.g. `git push`), but more are soon to follow.

The plugin calls the Giphy API when a keyword is matched at the moment. Probably gonna switch to a curated list in the future since the not all commands work as well as `push`.

![Demo of Plugin using git push command](example/git-push-demo.gif)

## How to use

Install [Hyper](https://hyper.is) and add `hyper-command-gifs`
to `plugins` in `~/.hyper.js`.

```javascript
plugins: [
  'hyper-command-gifs'
]
```
