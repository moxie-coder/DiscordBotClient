const express = require('express');
const https = require('https');
const morgan = require('morgan');
const { Server } = require('lambert-server');
const path = require('path');
const { readFileSync } = require('fs');
const { Writable } = require('stream');
const { scope } = require('electron-log');

class CustomLogStream extends Writable {
	logger = scope('APIServer');
	write(str) {
		this.logger.info(str.replace(/\n/g, ''));
	}
}

const logger = new CustomLogStream();

const Constants = require('./Constants');
const proxy = require('./Proxy');

const app = express();

app.use(
	morgan('dev', {
		stream: logger,
	}),
);

const server = https.createServer(Constants.HttpsOptions, app);

const route = express.Router();

const lambertServer = new Server({
	app: route,
	server,
	production: true,
	errorHandler: false,
	jsonBody: false,
});

// Routes
lambertServer.registerRoutes(path.resolve(__dirname, `routes`) + path.sep);
lambertServer.app = app;

const skipHeaders = [
	'cookie',
	'x-',
	'sec-',
	'referer',
	'origin',
	'authorization',
	'user-agent',
	'host',
];

// Handle headers
app.all('*', function (req, res, next) {
	const headers = {};
	if (req.headers.authorization) {
		headers.authorization = `Bot ${req.headers.authorization
			.replace(/bot/gi, '')
			.trim()}`;
		req.headers.authorization = headers.authorization;
		headers['user-agent'] = Constants.UserAgentDiscordBot;
	} else {
		headers['user-agent'] = Constants.UserAgentChrome;
	}
	req.originalHeaders = req.headers;
	Object.keys(req.headers).forEach((key) => {
		if (
			!skipHeaders.some((prefix) => key.toLowerCase().startsWith(prefix))
		) {
			headers[key] = req.headers[key];
		}
	});
	req.headers = headers;
	next();
});
// Routes: v10, v9, default, ...
app.use('/api/v10', route);
app.use('/api/v9', route);
app.use('/api', route);
app.use(route);
app.all('/developers/*', (req, res) => {
	return res.redirect('/app');
});
// Other
app.use((req, res, next) => {
	if (req.originalUrl.endsWith('.map')) return res.status(404).send();
	if (Constants.BlacklistRoutes.some((_) => req.originalUrl.includes(_)))
		return res.status(403).send({
			message: 'APIServer: Bots cannot use this endpoint',
			code: 20001,
		});
	// Main page
	if (['/', '/app'].includes(req.path))
		return res.send(readFileSync(Constants.DiscordHTMLPath, 'utf8'));
	// API routes
	if (req.originalUrl.includes('/api/')) return proxy.web(req, res);
	// Other routes
	req.headers = req.originalHeaders;
	return proxy.web(req, res);
});

module.exports = async function start() {
	return new Promise((resolve, reject) => {
		const callback = () => {
			const address = server.address();
			resolve(address.port);
			logger.logger.log(
				`API Server listening on https://localhost:${address.port}`,
			);
		};
		server.listen(0).once('listening', callback);
	});
};
