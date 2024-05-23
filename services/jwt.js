const JWT = require("jsonwebtoken");
const User = require("../models/user.model");
const secretKey = "MySecretKeyhehe";

function createToken(user) {
  const payload = {
    userName: user.userName,
    email: user.email,
    _id: user._id,
  };
  const token = JWT.sign(payload, secretKey);
  return token;
}

function verifyToken(token) {
  const user = JWT.verify(token, secretKey);

  return user;
}

module.exports = {
  createToken,
  verifyToken,
};
