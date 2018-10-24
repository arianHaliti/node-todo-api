const bcrypt = require("bcryptjs");

let password = "pass123";

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

let hashpass = "$2a$10$iFVxiLJCgZlOoDp3ubDSX.A7hnGje2c/EXTv0aWgc3TCIonC7XpNC";

bcrypt.compare(password, hashpass, (err, res) => {
  console.log(res);
});
