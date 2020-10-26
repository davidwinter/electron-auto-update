const test = require('ava');
const sinon = require('sinon');

const {ElectronAutoUpdate} = require('.');

let clock;

test.beforeEach(() => {
	clock = sinon.useFakeTimers();
});

test.afterEach(() => {
	clock.restore();
});

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

	t.is(updater.autoUpdater.logger, logger);
});

test('checks for updates at the frequency specified', t => {
	const checkSpy = sinon.spy();

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
});

test('displays dialog when download is ready', async t => {
	const dialogFake = sinon.fake.resolves({response: 0});
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
			showMessageBox: dialogFake
		}
	});

	await updater.checkForUpdates();

	t.truthy(dialogFake.calledOnce);
	t.truthy(quitSpy.calledOnce);
});

test('it will remind user to update if they choose later', async t => {
	const dialogFake = sinon.fake.resolves({response: 1, checkboxChecked: true});
	const quitSpy = sinon.spy();

	const updater = new ElectronAutoUpdate({
		checkFrequency: 5,
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
			showMessageBox: dialogFake
		}
	});

	await updater.checkForUpdates();

	clock.tick(7);

	t.is(dialogFake.callCount, 2);
	t.truthy(quitSpy.notCalled);
});

test('it will not remind a user to install update if they uncheck reminder', async t => {
	const dialogFake = sinon.fake.resolves({response: 1, checkboxChecked: false});
	const quitSpy = sinon.spy();

	const updater = new ElectronAutoUpdate({
		checkFrequency: 5,
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
			showMessageBox: dialogFake
		}
	});

	await updater.checkForUpdates();

	clock.tick(7);

	t.is(dialogFake.callCount, 1);
	t.truthy(quitSpy.notCalled);
});
