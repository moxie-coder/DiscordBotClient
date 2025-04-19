const { Router } = require('express');

const app = Router();

app.put('/', (req, res) => {
	res.status(403).send({
		message: 'APIServer: User is not eligible to join this server.',
		code: 150023,
	});
});

module.exports = app;
