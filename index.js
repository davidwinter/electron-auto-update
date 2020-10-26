const electronUpdater = require('electron-updater');
const {dialog} = require('electron');

class ElectronAutoUpdate {
	constructor(options = {}) {
		this.options = {
			checkFrequency: 1000 * 60 * 60,
			electronUpdater,
			dialog,
			logger: {
				info: () => {}
			},
			...options
		};

		if (options.logger) {
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

	get logger() {
		return this.options.logger;
	}

	async checkForUpdates() {
		this.logger.info('Checking for updates');

		this.autoUpdater.on('update-downloaded', async () => this.updateDownloaded());

		this.autoUpdater.on('update-not-available', () => {
			this.logger.info('Update not currently available');
			this.logger.info(`Will check again in ${this.checkFrequency} milliseconds`);

			setTimeout(() => {
				this.autoUpdater.checkForUpdatesAndNotify();
			}, this.checkFrequency);
		});

		this.autoUpdater.checkForUpdatesAndNotify();
	}

	async updateDownloaded() {
		this.logger.info('An update has been downloaded and is ready to install');

		const {response, checkboxChecked} = await this.showDownloadReadyDialog();

		if (response === 0) {
			this.logger.info('Quitting the app and installing update now');

			this.autoUpdater.quitAndInstall();

			return;
		}

		if (checkboxChecked) {
			this.logger.info('Will remind later to install update');

			setTimeout(() => {
				this.autoUpdater.checkForUpdatesAndNotify();
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
