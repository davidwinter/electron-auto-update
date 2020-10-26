const EventEmitter = require('events');

class AutoUpdateStub extends EventEmitter {
	constructor(options = {}) {
		super();

		this.options = {
			downloadAvailableIn: 0,
			onQuit: () => {},
			...options
		};

		if (this.options.downloadAvailableIn === 0) {
			this.downloadAvailable = true;
		} else {
			setTimeout(() => {
				this.downloadAvailable = true;
			}, this.options.downloadAvailableIn);
		}
	}

	checkForUpdatesAndNotify() {
		if (this.downloadAvailable) {
			this.emit('update-downloaded');
		} else {
			this.emit('update-not-available');
		}
	}

	quitAndInstall() {
		this.options.onQuit();
	}
}

module.exports = {
	AutoUpdateStub
};
