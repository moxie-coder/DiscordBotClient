const { Router } = require('express');
const { app: Electron } = require('electron');

const app = Router();

app.get('/', (req, res) => {
	return res.status(403).send({
		message: 'APIServer: Bots cannot use this endpoint',
		code: 20001,
	});
});

module.exports = app;
