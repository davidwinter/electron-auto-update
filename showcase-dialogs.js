const {app, BrowserWindow} = require('electron');
const {ElectronAutoUpdate} = require('.');

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
			autoUpdater: {
				quitAndInstall: () => {
					app.quit();
				}
			}
		}
	});

	setTimeout(() => {
		autoUpdate.updateDownloaded();
	}, 3000);

	return win;
});

app.on('window-all-closed', () => {
	app.quit();
});
