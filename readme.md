# electron-auto-update

**A user friendly way of having your Electron apps auto-update.**

This package depends on `electron-updater` which works wonders for handling the internals of auto-updating your application. This package aims to make the process of auto-updating a little more user-friendly for the users of your application, by presenting dialog boxes for them during the process. It helps application developers by trying to ensure that users upgrade as new verisons become available to ensure people aren't left behind on older versions that potentially have bugs.

## Features

- Checks for updates at a regular interval (defaults to each hour)
- Automatically downloads updates as they become available
- Prompts the user when an update is ready to be installed
- TODO: Reminds users that an update is ready to be installed
- TODO: Works with applications installed via snapcraft

## Usage

This package depends on `electron-update` which works alongside `electron-builder` which can handle the packaging and publishing of your applications versions. Ensure you have the `publish` [configuration setup](https://www.electron.build/configuration/publish) in your `package.json` file.


```
const {autoUpdate} = require('electron-auto-update');

autoUpdate();
```

`autoUpdate` can take the following options:

- `checkFrequency`: the time to check for updates in milliseconds. Default: 3600000 (1 hour)

## Development

```
npm install
npm test
```
