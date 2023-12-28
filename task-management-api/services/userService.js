const asyncHandler = require("express-async-handler");
const { User } = require("../models");
const bcrypt = require("bcrypt");

exports.findByEmailOrID = (id, email = null) => {
  const where = {};
  if (id) {
    where.id = id;
  }

  if (email) {
    where.email = email;
  }

  return User.findOne({
    where,
  });
};

exports.registerUser = asyncHandler(async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return User.create({ ...userData, password: hashedPassword });
});

exports.loginUser = asyncHandler(async (email, password) => {
  const user = await exports.findByEmailOrID(null, email);
  if (!user) {
    throw new Error(`Email Not Found`);
  }
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new Error("Invalid Password");
  }
  return user;
});
