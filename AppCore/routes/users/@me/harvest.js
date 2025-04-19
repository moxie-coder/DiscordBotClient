const { Router } = require('express');

const app = Router();

app.get('/', (req, res) => {
	res.send();
});

app.post('/', (req, res) => {
	return res.status(403).send({
		message: 'APIServer: Bots cannot use this endpoint',
		code: 20001,
	});
})

module.exports = app;
