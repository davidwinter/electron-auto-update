const test = require('ava');
const sinon = require('sinon');

const {ElectronAutoUpdate} = require('.');

test('uses default options', t => {
	const updater = new ElectronAutoUpdate({
		electronUpdater: {
			autoUpdater: {}
		}
	});

	t.like(updater.options, {
		checkFrequency: 1000 * 60 * 60
	});
});

test('allows override of default options', t => {
	const updater = new ElectronAutoUpdate({
		checkFrequency: 5,
		electronUpdater: {
			autoUpdater: {}
		}
	});

	t.like(updater.options, {
		checkFrequency: 5
	});
});

test('sets the logger for electron-updater', t => {
	const logger = {};
	const updater = new ElectronAutoUpdate({
		logger,
		electronUpdater: {
			autoUpdater: {}
		}
	});

	t.is(updater.options.electronUpdater.autoUpdater.logger, logger);
});

test('checks for updates at the frequency specified', t => {
	const clock = sinon.useFakeTimers();

	const checkSpy = sinon.fake();

	const updater = new ElectronAutoUpdate({
		checkFrequency: 5,
		electronUpdater: {
			autoUpdater: {
				checkForUpdatesAndNotify: checkSpy,
				on: () => {}
			}
		}
	});

	updater.checkForUpdates();

	clock.tick(7);

	t.is(checkSpy.callCount, 2);

	clock.restore();
});

test('displays dialog when download is ready', t => {
	const dialogFake = sinon.fake.returns(0);
	const quitSpy = sinon.spy();

	const updater = new ElectronAutoUpdate({
		electronUpdater: {
			autoUpdater: {
				checkForUpdatesAndNotify: () => {},
				on: (eventName, fn) => {
					fn();
				},
				quitAndInstall: quitSpy
			}
		},
		dialog: {
			showMessageBoxSync: dialogFake
		}
	});

	updater.checkForUpdates();

	t.truthy(dialogFake.calledOnce);
	t.is(quitSpy.callCount, 1);
});
