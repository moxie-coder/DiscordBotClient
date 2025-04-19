const { Router } = require('express');

const app = Router();

app.all('/', (req, res) => {
	res.send({
		eligible: 0,
	});
});

module.exports = app;
