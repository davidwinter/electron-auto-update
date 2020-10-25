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
			this.options.electronUpdater.logger = this.options.logger;
		}
	}

	checkForUpdates() {
		this.options.electronUpdater.on('update-downloaded', () => {
			const relaunchChoice = this.options.dialog.showMessageBoxSync({
				type: 'question',
				title: 'Install update',
				message: 'A new update is ready. When would you like to install?',
				buttons: ['Now and relaunch', 'When I next quit nimblenote'],
				defaultId: 0,
				cancelId: 1
			});

			if (relaunchChoice === 0) {
				this.options.electronUpdater.quitAndInstall();
			}
		});

		this.options.electronUpdater.checkForUpdatesAndNotify();

		setInterval(() => {
			this.options.electronUpdater.checkForUpdatesAndNotify();
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
