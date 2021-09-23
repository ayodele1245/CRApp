const bcrypt = require("bcrypt");
const salt = 10;

const hashPassword = (plainPassword) => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(plainPassword, salt));
  });
};

const comparePassword = (plainPass, passFromDb) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPass, passFromDb, function (err, result) {
      if (err) reject(err);

      resolve(result);
    });
  });
};

module.exports = {
  hashPassword,
  comparePassword,
};
