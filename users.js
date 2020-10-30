const axios = require('axios');
const config = require("./config");

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

  function login() {
    if (myServices.length > 0) {
      const service = myServices[Math.floor(Math.random() * myServices.length)];
      query(axios.post(service.service.endpoint + '/login', {
        username: username,
        password: service.password
      })).then(() => {
        if (config.debug) console.log('User ' + username + ' logged in successfully.');
        setTimeout(login, config.minLoginWait + Math.random() * (config.maxLoginWait - config.minLoginWait));
      });
    }
  }
  login();
}

(async () => {
  for (let i = 0; i < config.N; i++) {
    await createUser();
    if (config.debug) console.log('Created user (' + (i+1) + '/' + config.N + ')');
  }
})();

setTimeout(() => {
  console.log('True Negatives: ' + trueNegatives);
  console.log('False Positives: ' + falsePositives);
  process.exit();
}, config.experimentDuration);