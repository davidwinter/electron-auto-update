const {app, BrowserWindow} = require('electron');
const {ElectronAutoUpdate} = require('.');
const {AutoUpdateStub} = require('./auto-update-stub');

app.whenReady().then(() => {
	const win = new BrowserWindow({
		width: 400,
		height: 400,
		webPreferences: {
			nodeIntegration: true
		}
	});

	const autoUpdate = new ElectronAutoUpdate({
		checkFrequency: 3000,
		electronUpdater: {
			autoUpdater: new AutoUpdateStub({
				onQuit: app.quit,
				downloadAvailableIn: 5000
			})
		},
		logger: {
			info: message => {
				console.log(`electron-auto-update: ${message}`);
			}
		}
	});

	setTimeout(() => {
		autoUpdate.checkForUpdates();
	}, 3000);

	return win;
});

app.on('window-all-closed', () => {
	app.quit();
});
