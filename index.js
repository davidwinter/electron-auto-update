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

	get autoUpdater() {
		return this.options.electronUpdater.autoUpdater;
	}

	get checkFrequency() {
		return this.options.checkFrequency;
	}

	get dialog() {
		return this.options.dialog;
	}

	async checkForUpdates() {
		this.autoUpdater.on('update-downloaded', async () => this.updateDownloaded());

		this.autoUpdater.checkForUpdatesAndNotify();

		setInterval(() => {
			this.autoUpdater.checkForUpdatesAndNotify();
		}, this.checkFrequency);
	}

	async updateDownloaded() {
		const {response, checkboxChecked} = await this.showDownloadReadyDialog();

		if (response === 0) {
			this.autoUpdater.quitAndInstall();
			return;
		}

		if (checkboxChecked) {
			setTimeout(async () => {
				this.updateDownloaded();
			}, this.checkFrequency);
		}
	}

	showDownloadReadyDialog() {
		return this.dialog.showMessageBox({
			type: 'question',
			title: 'Update ready to be installed',
			message: 'A new update is ready. When would you like to install?',
			buttons: ['Now', 'Later'],
			defaultId: 0,
			cancelId: 1,
			checkboxLabel: 'Remind me again if I choose later',
			checkboxChecked: true
		});
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
