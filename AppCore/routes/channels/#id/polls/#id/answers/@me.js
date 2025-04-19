const { Router } = require('express');

const app = Router();

app.put('/', (req, res) => {
	res.status(403).send({
		message:
			'APIServer: Apps are not allowed to vote on polls.',
		code: 520000,
	});
});

module.exports = app;
