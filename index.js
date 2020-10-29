const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/info', (req, res) => {
  return res.status(200).send({
  	message: 'hello'
  });
});

app.listen(4000);