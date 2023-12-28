const jwt = require("jsonwebtoken");

exports.dataForAccessToken = (user) => ({
  userId: user.id,
  email: user.email,
});

exports.generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.generateRefreshToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.verifyToken = (accessToken) => {
  return jwt.verify(accessToken, process.env.JWT_SECRET);
};
