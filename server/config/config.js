var env = process.env.NODE_ENV || "development";
console.log("maaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
console.log(`env ********* ${env}`);

if (env === "development" || env === "test") {
  let config = require("./config.json");
  let envConfig = config[env];

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
    console.log(key, envConfig[key]);
  });
}

// if (env === "development") {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/TodoApp";
// } else if (env === "test") {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/TodoAppTest";
// }
