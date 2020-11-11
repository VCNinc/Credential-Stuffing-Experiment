const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');
const config = require("./config");
const app = express();
const port = parseInt(process.argv[3]) || 4000;

if (config.debug) console.log(process.argv);

var users = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/reset', (req, res) => {
  users = {};
  if (config.debug) console.log("Service reset! (" + port + ")");
  return res.status(200).send();
});

app.get('/kill', (req, res) => {
  if (config.debug) console.log("Process exiting! (" + port + ")");
  process.exit();
  return res.status(200).send();
});

app.post('/register', (req, res) => {
  if (config.debug) console.log(req.body);

  axios.post(config.central + '/register', {
    service: 'https://localhost:' + port,
    hash: crypto.createHash('sha256').update(req.body.username + req.body.password).digest('hex')
  }).then((data) => {
    if (data.data.valid) {
      users[req.body.username] = req.body.password;
      if (config.debug) console.log('Successful registration (' + req.body.username + ':' + req.body.password + ')');
      return res.status(200).send({success: true});
    } else {
      return res.status(200).send({success: false});
    }
  });
});

app.post('/login', (req, res) => {
  axios.post(config.central + '/login', {
    service: 'https://localhost:' + port,
    hash: crypto.createHash('sha256').update(req.body.username + req.body.password).digest('hex')
  }).then((data) => {
    if (data.data.valid) {
      if (users[req.body.username] === req.body.password) {
        if (config.debug) console.log('Successful login (' + req.body.username + ':' + req.body.password + ')');
        return res.status(200).send({success: true});
      } else {
        if (config.debug) console.log('Failed login (' + req.body.username + ':' + req.body.password + ')');
        return res.status(200).send({success: false});
      }
    } else {
      return res.status(200).send({success: false});
    }
  });
});

app.get('/leak', (req, res) => {
  return res.status(200).send({users: users});
});

if (config.debug) console.log('Starting server...');
app.listen(port, () => {
  if (config.debug) console.log('Server running on port ' + port + '.');
});