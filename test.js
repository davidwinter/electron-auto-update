const test = require('ava');
const sinon = require('sinon');

const {AutoUpdateStub} = require('./auto-update-stub');

const {ElectronAutoUpdate} = require('.');

test.beforeEach(t => {
	t.context.sandbox = sinon.createSandbox({
		useFakeTimers: true
	});
});

test.afterEach(t => {
	const sandbox = t.context.sandbox;

	sandbox.clock.restore();
	sandbox.restore();
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
	const checkSpy = t.context.sandbox.spy();
	const dialogFake = t.context.sandbox.fake.resolves({response: 1});

	const updater = new ElectronAutoUpdate({
		checkFrequency: 5,
		electronUpdater: {
			autoUpdater: {
				checkForUpdatesAndNotify: checkSpy,
				on: (eventName, fn) => {
					if (eventName === 'update-not-available') {
						fn();
					}
				}
			}
		},
		dialog: {
			showMessageBox: dialogFake
		}
	});

	updater.checkForUpdates();

	t.context.sandbox.clock.tick(7);

	t.is(checkSpy.callCount, 2);
});

test('displays dialog when download is ready', async t => {
	const dialogFake = t.context.sandbox.fake.resolves({response: 0});
	const quitSpy = t.context.sandbox.spy();

	const updater = new ElectronAutoUpdate({
		electronUpdater: {
			autoUpdater: new AutoUpdateStub({
				onQuit: quitSpy,
				downloadAvailableIn: 0
			})
		},
		dialog: {
			showMessageBox: dialogFake
		}
	});

	await updater.checkForUpdates();

	t.is(dialogFake.callCount, 1);
	t.truthy(quitSpy.calledOnce);
});

test('it will remind user to update if they choose later', async t => {
	const dialogFake = t.context.sandbox.fake.resolves({response: 1, checkboxChecked: true});
	const quitSpy = t.context.sandbox.spy();

	const updater = new ElectronAutoUpdate({
		checkFrequency: 5,
		electronUpdater: {
			autoUpdater: new AutoUpdateStub({onQuit: quitSpy})
		},
		dialog: {
			showMessageBox: dialogFake
		}
	});

	await updater.checkForUpdates();

	t.context.sandbox.clock.tick(7);

	t.is(dialogFake.callCount, 2);
	t.truthy(quitSpy.notCalled);
});

test('it will not remind a user to install update if they uncheck reminder', async t => {
	const dialogFake = t.context.sandbox.fake.resolves({response: 1, checkboxChecked: false});
	const quitSpy = t.context.sandbox.spy();

	const updater = new ElectronAutoUpdate({
		checkFrequency: 5,
		electronUpdater: {
			autoUpdater: new AutoUpdateStub()
		},
		dialog: {
			showMessageBox: dialogFake
		}
	});

	await updater.checkForUpdates();

	t.context.sandbox.clock.tick(7);

	t.truthy(dialogFake.calledOnce);
	t.truthy(quitSpy.notCalled);
});
