const axios = require('axios');
const config = require("./config");
const fs = require('fs');

var trueNegatives = 0;
var falsePositives = 0;

async function query(request, delay = 500) {
  try {
    let result = await request;
    trueNegatives++;
    return result;
  } catch (err) {
    falsePositives++;
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        query(request, delay * 2).then((res) => {
          resolve(res);
        });
      }, delay);
    });
  }
}

async function createUser() {
  let username = Math.random().toString(36).substring(7);
  let onePassword = Math.random().toString(36).substring(7);
  let character = Math.random();
  let myServices = [];

  for (let service of config.services) {
    if (Math.random() < service.popularity) {
      let password = '';

      if (character < config.fullReuse) {
        password = onePassword;
      } else if (character < config.someReuse && Math.random() < config.someReusePortion) {
        password = onePassword;
      } else {
        password = Math.random().toString(36).substring(7);
      }

      let result = await query(axios.post(service.endpoint + '/register', {
        username: username,
        password: password
      }));

      if (result.data.success) {
        myServices.push({
          service: service,
          password: password
        });
      } else {
        password = Math.random().toString(36).substring(7);
        await query(axios.post(service.endpoint + '/register', {
          username: username,
          password: password
        }));
        myServices.push({
          service: service,
          password: password
        });
      }
    }
  }

  function login() {
    if (myServices.length > 0) {
      let service = myServices[Math.floor(Math.random() * myServices.length)];
      query(axios.post(service.service.endpoint + '/login', {
        username: username,
        password: service.password
      })).then((res) => {
        if (res.data.success) {
          if (config.debug) console.log('User ' + username + ' logged in successfully.');
          setTimeout(login, config.minLoginWait + Math.random() * (config.maxLoginWait - config.minLoginWait));
        } else {
          setTimeout(() => {
            service.password = Math.random().toString(36).substring(7);
            query(axios.post(service.endpoint + '/register', {
              username: username,
              password: service.password
            })).then(() => {
              setTimeout(login, config.minLoginWait + Math.random() * (config.maxLoginWait - config.minLoginWait));
            });
          }, config.passwordChangeTime);
        }
      });
    }
  }
  login();
}

(async () => {
  // Reset central service
  await axios.get(config.central + '/reset');

  // Reset all services
  for (let service of config.services) {
    await query(axios.get(service.endpoint + '/reset'));
    if (config.debug) console.log('Reset service: ' + service.endpoint);
  }

  // Create N users
  for (let i = 0; i < config.N; i++) {
    await createUser();
    if (config.debug) console.log('Created user (' + (i+1) + '/' + config.N + ')');
  }
})();

setTimeout(() => {
  console.log('True Negatives: ' + trueNegatives);
  fs.appendFileSync('experiment.log', 'TN,' + trueNegatives + "\n");
  console.log('False Positives: ' + falsePositives);
  fs.appendFileSync('experiment.log', 'FP,' + falsePositives + "\n");
  process.exit();
}, config.experimentDuration);