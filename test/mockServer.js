const express = require('express');
const bodyParser = require('body-parser');
const bookController = require('./mockController');


const app = express();

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/clear', bookController.clearDB, (req, res) => 
	res.sendStatus(200)
);

app.get('/book', bookController.getAll, (req, res) => 
	res.status(200).json(res.locals.books)
);

app.post('/book', bookController.addBook, (req, res) => 
	res.status(200).json(res.locals.books)
);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
