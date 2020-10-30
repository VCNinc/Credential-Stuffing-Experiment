const axios = require('axios');

const N = 10;
const services = [
  {endpoint: 'http://localhost:100', popularity: Math.random()}
];
const minLoginWait = 1000;
const maxLoginWait = 5000;
const fullReuse = 0.59;
const someReuse = 0.81;
const someReusePortion = 0.50;

async function query(request, delay = 500) {
  try {
    return await request;
  } catch (err) {
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

  for (let service of services) {
    if (Math.random() < service.popularity) {

      let password = '';

      if (character < fullReuse) {
        password = onePassword;
      } else if (character < someReuse && Math.random() < someReusePortion) {
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
        console.log('User ' + username + ' logged in successfully.');
        setTimeout(login, minLoginWait + Math.random() * (maxLoginWait - minLoginWait));
      });
    }
  }
  login();
}

(async () => {
  for (let i = 0; i < N; i++) {
    await createUser();
    console.log('Created user (' + (i+1) + '/' + N + ')');
  }
})();