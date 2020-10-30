const axios = require('axios');
const config = require("./config");

(async () => {
  for (let service of config.services) {
    console.log('Killing service: ' + service.endpoint);
    try {
      axios.get(service.endpoint + '/kill');
    } catch (err) {
      console.error(err);
    }
    console.log('Killed service: ' + service.endpoint);
  }
})();