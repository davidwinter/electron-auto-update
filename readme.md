# electron-auto-update

[![test](https://github.com/davidwinter/electron-auto-update/workflows/Node.js%20CI/badge.svg)](https://github.com/davidwinter/electron-auto-update/actions?query=workflow%3ANode.js%20CI) [![npm](https://img.shields.io/npm/v/electron-auto-update)](https://www.npmjs.com/package/electron-auto-update) [![npm](https://img.shields.io/npm/dw/electron-auto-update)](https://www.npmjs.com/package/electron-auto-update)

> A user friendly way of having your Electron apps auto-update

![electron-auto-update screenshot](https://github.com/davidwinter/electron-auto-update/raw/main/screenshot.png)

This package builds upon the great work done by `electron-builder` and `electron-updater`, both of which make it really easy for you to package and publish your Electron apps. The latter package works wonders for handling the internals of auto-updating your application.

`electron-auto-update` aims to make the process of auto-updating a little more user-friendly, by presenting a dialog box when an update has been downloaded and is ready to be installed, which happens upon relaunch of the application. It will also check for updates on a regular frequency.

## Features

- Checks for updates at a regular interval (defaults to each hour)
- Automatically downloads updates as they become available
- Displays a dialog window and prompts the user to relaunch to update
- Reminds users that an update is ready to be installed

## Coming soon

- Works with applications installed via snapcraft

## Usage

**Your project should already be using `electron-builder` to package and publish your application. Ensure you have the `publish` [configuration setup](https://www.electron.build/configuration/publish) in your `package.json` file as `electron-auto-update` will use that configuration for detecting new versions available for update.**


```js
const {autoUpdate} = require('electron-auto-update');

autoUpdate();
```

If you would like to manually trigger an update check, for example, via a menu bar in a scenario where the user has chosen not to receive future notifications, then you can use the `triggerUpdateCheck()` method like so:

```js
const {autoUpdate} = require('electron-auto-update');

// Assign the updater to a variable that you can call manually
const updater = autoUpdate();

// Call at some point later:
updater.triggerUpdateCheck();
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
np
```
