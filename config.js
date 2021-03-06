module.exports = {
  "N": 1000,
  "central": "http://localhost:4444",
  "services": [
    {"endpoint": "http://localhost:3000", "popularity": Math.random()},
    {"endpoint": "http://localhost:3001", "popularity": Math.random()},
    {"endpoint": "http://localhost:3002", "popularity": Math.random()},
    {"endpoint": "http://localhost:3003", "popularity": Math.random()},
    {"endpoint": "http://localhost:3004", "popularity": Math.random()},
    {"endpoint": "http://localhost:3005", "popularity": Math.random()},
    {"endpoint": "http://localhost:3006", "popularity": Math.random()},
    {"endpoint": "http://localhost:3007", "popularity": Math.random()},
    {"endpoint": "http://localhost:3008", "popularity": Math.random()},
    {"endpoint": "http://localhost:3009", "popularity": Math.random()}
  ],
  "minLoginWait": 10000,
  "maxLoginWait": 50000,
  "fullReuse": 0.59,
  "someReuse": 0.81,
  "someReusePortion": 0.50,
  "experimentDuration": (2 * 60 * 1000),
  "attackStart": (1 * 60 * 1000),
  "debug": false,
  "passwordChangeTime": 0
};