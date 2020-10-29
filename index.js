const config = require('./config.json');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Initialize services
console.log('Initializing ' + config.service_quantity + ' services...');
var services = [];
for (let i = 0; i < config.service_quantity; i++) {
  services.push({
    popularity: Math.random()
  });
}
console.log(config.service_quantity + ' services initialized.' + "\n");

// Create endpoints
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/info', (req, res) => {
  return res.status(200).send({
    services: services
  });
});

// Start server
console.log('Starting server...');
app.listen(config.port, () => {
  console.log('Server running on port ' + config.port + '.');
});