# Fork from Hyper Command GIFs

Plugin for Hyper™ terminal. Fork from Hyper Command GIFs

Enhances your daily terminal routine with GIFs. Because why not.

Currently the plugin matches for the following keywords in your commands:

- build
- checkout
- deploy
- pull
- push
- start
- test
- install
- clone

More to come in the next few days!

![Demo of Plugin using git push command](example/git-push-demo.gif)

## How to use

Install [Hyper](https://hyper.is) and add `hyper-command-gifs`
to `plugins` in `~/.hyper.js`.

```javascript
plugins: [
  'hyper-command-gifs'
]
```

## Config

To configure the plugin simply add a `hyperCommandGifs` property to the config object in `~/.hyper.js`.
The only option right now is to disable certain commands to prevent them from matching and showing GIFs.

Let's say you are switching branches like a maniac and hitting `npm test` every 5 seconds, then just disable them like this:

```javascript
module.exports = {
  config: {
    // ...all the other default options


    hyperCommandGifs: {
      disabledCommands: ['checkout', 'test']
    }
  }
}
```
