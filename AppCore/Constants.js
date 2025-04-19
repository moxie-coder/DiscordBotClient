const { nativeImage, app } = require('electron');
const path = require('path');
const UserPatch = require('../AppAssets/UserPatch');
const { readFileSync } = require('fs');

module.exports = class Constants extends null {
	static BlacklistRoutes = [
		'outbound-promotions/codes',
		'science',
		'applications/public',
		'notes',
		'roles/member-counts',
		'member-ids',
		'connections/',
		'users/@me/disable',
		'users/@me/delete',
		'users/@me/mfa',
		'users/@me/phone',
		'interaction-data',
		'member-verification',
		'cdn-cgi/challenge-platform',
		'explicit-media',
		'premium/subscriptions',
		'/ack',
		'/stripe',
		'/paypal',
		'/validate-billing-address',
		'auth/conditional/start', // Disable WebAuthn
	];
	static LatestStorageUpdate = 1735000000000;
	static APP_NAME = 'DiscordBotClient';
	static iconPath = path.join(
		__dirname,
		'..',
		'AppAssets',
		'DiscordBotClient.png',
	);
	static icon16 = nativeImage
		.createFromPath(Constants.iconPath)
		.resize({ width: 16 });
	static icon128 = nativeImage
		.createFromPath(Constants.iconPath)
		.resize({ width: 128 });
	static DiscordBackgroundColor = '#36393f';
	static UserAgentChrome =
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 DiscordBotClient/' +
		app.getVersion();
	static UserAgentDiscordBot = `DiscordBot (https://github.com/aiko-chan-ai/DiscordBotClient, v${app.getVersion()})`;
	static VencordExtensionPath = path.join(
		__dirname,
		'..',
		'VencordExtension',
	);
	static DiscordHTMLPath = path.join(
		__dirname,
		'..',
		'DiscordCore',
		'index.html',
	);
	static DiscordGuildExperimentsPath = path.join(
		__dirname,
		'..',
		'DiscordCore',
		'guild_experiments.json',
	);
	static HttpsOptions = {
		key: readFileSync(
			path.resolve(__dirname, 'cert', 'server.key'),
		).toString('utf-8'),
		cert: readFileSync(
			path.resolve(__dirname, 'cert', 'server.cert'),
		).toString('utf-8'),
	};
	static UserDefaultPatch = UserPatch['1056491867375673424'];
	static ChannelIdDefault = '1000000000000000000';
	static UserIdDefault = '1056491867375673424';
	static CustomDiscordDomain = 'discord.com';
	static CacheAssetsMode = false;
	static MaxGuildsPerShard = 100;
	// Database
	static DirectMessages = {
		name: 'DMsData',
		path: 'DirectMessages',
	};
	static PreloadedUserSettings = {
		name: 'UserSettingsProto1',
		path: 'PreloadedUserSettings',
	};
	static FrecencyUserSettings = {
		name: 'UserSettingsProto2',
		path: 'FrecencyUserSettings',
	};
};
