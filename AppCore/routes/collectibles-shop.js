const { Router } = require('express');

const app = Router();

app.get('/', (req, res) => {
	res.send({
		shop_blocks: [],
		categories: [],
	});
});

module.exports = app;
