# electron-auto-update [![Build Status](https://travis-ci.org/davidwinter/electron-auto-update.svg?branch=main)](https://travis-ci.org/davidwinter/electron-auto-update)

> A user friendly way of having your Electron apps auto-update

This package builds upon the great work done by `electron-builder` and `electron-updater`, both of which make it really easy for you to package and publish your Electron apps. The latter package works wonders for handling the internals of auto-updating your application.

`electron-auto-update` aims to make the process of auto-updating a little more user-friendly, by presenting a dialog box when an update has been downloaded and is ready to be installed, which happens upon relaunch of the application. It will also check for updates on a regular frequency.

## Features

- Checks for updates at a regular interval (defaults to each hour)
- Automatically downloads updates as they become available
- Displays a dialog window and prompts the user to relaunch to update

## Coming soon

- Remind users that an update is ready to be installed
- Works with applications installed via snapcraft

## Usage

**Your project should already be using `electron-builder` to package and publish your application. Ensure you have the `publish` [configuration setup](https://www.electron.build/configuration/publish) in your `package.json` file as `electron-auto-update` will use that configuration for detecting new versions available for update.**


```js
const {autoUpdate} = require('electron-auto-update');

autoUpdate();
```

## API

### autoUpdate(options?)

Will setup a regular check for updates using any additonal options specified.

#### options

Type: `object`

##### checkFrequency

Type: `integer`\
Default: `3600000`

The frequency in milliseconds to check for updates. Defaults to 1 hour.

## Development

```
npm install
npm test
```
