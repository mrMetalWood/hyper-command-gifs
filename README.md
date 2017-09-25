#  Fork from Hyper Command GIFs

Plugin for Hyper™ terminal. Fork from [Hyper Command GIFs](https://www.npmjs.com/package/hyper-command-gifs)

  Enhances your daily terminal routine with GIFs. Because why not.

  Displays a gif when opening and when execute some commands

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


## How to use
![Demo of Plugin using git push command](example/git-push-demo.gif)


## Config

Install [Hyper](https://hyper.is) and add `hyper-command-gifs-naay`
to `plugins` in `~/.hyper.js`.

```javascript
plugins: [
  'hyper-command-gifs-naay'
]
```

To configure the plugin simply add a `hyperCommandGifs` property to the config object in `~/.hyper.js`.
These are the options available :

- disabledCommands : Allow you to disable the gifs for the listed commands

Default : []

To configure the plugin simply add a `hyperCommandGifs` property to the config object in `~/.hyper.js`.
These are the options available :

- disabledCommands : Allow you to disable the gifs for the listed commands 

Default : []

- gifTimeout : Defining the duration of the gif

Default : 3000

- gifHello : Activate or not the gif when opening Hyper terminal

Default : true

-customGifs : Allow you to add some gifs to default commands and also to add commands

Default : {}, Usage : {sudo : ["url_to_the_gif","other_url],install : ["one_more_gif]"

- deleteDefaultGifs : Removes the original GIF list

Default : false, ⚠️ if you set at false  and you don't add a custom gif, no gif will be loaded

- gifTimeout : Defining the duration of the gif

Default : 3000

- gifHello : Activate or not the gif when opening Hyper terminal

Default : true

- customGifs : Allow you to add some gifs to default commands and also to add commands

Default : {}, Usage : {sudo : ["url_to_the_gif","other_url],install : ["one_more_gif]"

- deleteDefaultGifs : Removes the original GIF list

Default : false, ⚠️ if you set at false  and you don't add a custom gif, no gif will be loaded


Exemple :


  ```javascript
  module.exports = {
    config: {
      // ...all the other default options

      hyperCommandGifs: {
        disabledCommands: ['checkout', 'test'],
        gifTimeout: 3500,
        gifHello: false,
        deleteDefaultGifs : false,
        customGifs : {commit : ["https://media.giphy.com/media/3o85xtLX7zCyeeWGLC/giphy.gif","https://media.giphy.com/media/14sbteMPBcGQUg/giphy.gif"], build : ["https://media.giphy.com/media/3o7TKP9ln2Dr6ze6f6/giphy.gif"]}
      }
  }
  ```