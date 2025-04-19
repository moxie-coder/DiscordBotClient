module.exports = class IPCEvent extends null {
	static Close = 'DBC_CLOSE';
	static Minimize = 'DBC_MINIMIZE';
	static Maximize = 'DBC_MAXIMIZE';
	static Focus = 'DBC_FOCUS';
	static GetBotInfo = 'DBC_GET_BOT_INFO';
	static GetBotInfoResponse = 'DBC_GET_BOT_INFO_RESPONSE';
	static GetDBCVersions = 'DBC_GET_DBC_VERSIONS';
	static GetPreloadedUserSettings = 'DBC_GET_PRELOADED_USER_SETTINGS';
	static GetExperiment = 'DBC_GET_EXPERIMENT';
	static GetPrivateChannel = 'DBC_GET_PRIVATE_CHANNEL';
	static HandlePrivateChannel = 'DBC_HANDLE_PRIVATE_CHANNEL';
	static GetDefaultUserPatch = 'DBC_GET_DEFAULT_USER_PATCH';
	static LogFromMainProcess = 'DBC_LOG_FROM_MAIN_PROCESS';
};