const { contextBridge, ipcRenderer } = require('electron');
const IPCEvent = require('./IPCEvent');

function getUserDefaultPatch() {
	return ipcRenderer.sendSync(IPCEvent.GetDefaultUserPatch);
}

class Logger {
	constructor() {}
	_log(scope, level, color, args) {
		console[level](
			`%c MainProcess %c %c ${scope} `,
			`background: ${color}; color: black; font-weight: bold; border-radius: 5px;`,
			'',
			`background: #99d1db; color: black; font-weight: bold; border-radius: 5px;`,
			...args,
		);
	}
	log(scope, ...args) {
		this._log(scope, 'log', '#a6d189', args);
	}
	info(scope, ...args) {
		this._log(scope, 'info', '#a6d189', args);
	}
	error(scope, ...args) {
		this._log(scope, 'error', '#e78284', args);
	}
	warn(scope, ...args) {
		this._log(scope, 'warn', '#e5c890', args);
	}
	debug(scope, ...args) {
		this._log(scope, 'debug', '#eebebe', args);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	const logger = new Logger();
	ipcRenderer.on(
		IPCEvent.LogFromMainProcess,
		(_event, scope, level, ...args) => {
			logger[level](scope, ...args);
		},
	);
});

contextBridge.exposeInMainWorld('BotClientNative', {
	getBotInfo: (token) => {
		return new Promise((resolve, reject) => {
			ipcRenderer.once(IPCEvent.GetBotInfoResponse, (event, response) => {
				resolve(response);
			});
			ipcRenderer.send(IPCEvent.GetBotInfo, token);
		});
	},
	getBotClientVersion() {
		return ipcRenderer.sendSync(IPCEvent.GetDBCVersions);
	},
	getSettingProto1(id) {
		return ipcRenderer.sendSync(IPCEvent.GetPreloadedUserSettings, id);
	},
	getPrivateChannelLogin(botId, pluginSaveDMsEnable) {
		if (!pluginSaveDMsEnable)
			return [
				{
					type: 1,
					recipients: [getUserDefaultPatch()],
					last_message_id: '1000000000000000000',
					is_spam: false,
					id: '1000000000000000000',
					flags: 0,
				},
			];
		const privateChannel = ipcRenderer.sendSync(
			IPCEvent.GetPrivateChannel,
			botId,
		);
		const allChannel = Object.values(privateChannel);
		allChannel.unshift({
			type: 1,
			recipients: [getUserDefaultPatch()],
			last_message_id: '1000000000000000000',
			is_spam: false,
			id: '1000000000000000000',
			flags: 0,
		});
		return allChannel;
	},
	getUserExperiments(allData, botId) {
		return ipcRenderer.sendSync(
			IPCEvent.GetExperiment,
			'user',
			allData,
			botId,
		);
	},
	getGuildExperiments() {
		return ipcRenderer.sendSync(IPCEvent.GetExperiment, 'guild');
	},
	handleOpenPrivateChannel(botId, userId, channelId) {
		return ipcRenderer.sendSync(
			IPCEvent.HandlePrivateChannel,
			'add',
			botId,
			channelId,
			userId,
		);
	},
	handleClosePrivateChannel(botId, channelId) {
		return ipcRenderer.sendSync(
			IPCEvent.HandlePrivateChannel,
			'remove',
			botId,
			channelId,
		);
	},
	clearDMsCache(botId) {
		return ipcRenderer.sendSync(
			IPCEvent.HandlePrivateChannel,
			'clear',
			botId,
		);
	},
	// Vesktop
	close(frameName) {
		ipcRenderer.send(IPCEvent.Close, frameName);
	},
	minimize(frameName) {
		ipcRenderer.send(IPCEvent.Minimize, frameName);
	},
	maximize(frameName) {
		ipcRenderer.send(IPCEvent.Maximize, frameName);
	},
	focus(frameName) {
		ipcRenderer.send(IPCEvent.Focus, frameName);
	},
});
