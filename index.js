const electronUpdater = require('electron-updater');
const {dialog} = require('electron');

class ElectronAutoUpdate {
	constructor(options = {}) {
		this.options = {
			checkFrequency: 1000 * 60 * 60,
			electronUpdater,
			dialog,
			...options
		};

		if (this.options.logger) {
			this.options.electronUpdater.autoUpdater.logger = this.options.logger;
		}
	}

	checkForUpdates() {
		const autoUpdater = this.options.electronUpdater.autoUpdater;

		autoUpdater.on('update-downloaded', () => {
			const relaunchChoice = this.options.dialog.showMessageBoxSync({
				type: 'question',
				title: 'Install update',
				message: 'A new update is ready. When would you like to install?',
				buttons: ['Now and relaunch', 'When I next quit'],
				defaultId: 0,
				cancelId: 1
			});

			if (relaunchChoice === 0) {
				autoUpdater.quitAndInstall();
			}
		});

		autoUpdater.checkForUpdatesAndNotify();

		setInterval(() => {
			autoUpdater.checkForUpdatesAndNotify();
		}, this.options.checkFrequency);
	}
}

module.exports = {
	ElectronAutoUpdate,
	autoUpdate: options => {
		const updater = new ElectronAutoUpdate(options);
		updater.checkForUpdates();
		return updater;
	}
};
