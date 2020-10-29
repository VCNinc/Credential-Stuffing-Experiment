const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;

const popularity = Math.random();
var users = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/info', (req, res) => {
  return res.status(200).send({
    popularity: popularity
  });
});

app.post('/register', (req, res) => {
  users[req.body.username] = req.body.password;
  console.log('Successful registration (' + req.body.username + ':' + req.body.password + ')');
  return res.status(200).send();
});

app.post('/login', (req, res) => {
  if (users[req.body.username] === req.body.password) {
    console.log('Successful login (' + req.body.username + ':' + req.body.password + ')');
    return res.status(200).send({success: true});
  } else {
    console.log('Failed login (' + req.body.username + ':' + req.body.password + ')');
    return res.status(200).send({success: false});
  }
});

console.log('Starting server...');
app.listen(port, () => {
  console.log('Server running on port ' + port + '.');
});