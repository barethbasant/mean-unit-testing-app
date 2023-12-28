const jwt = require("jsonwebtoken");
const { User } = require("../models");

const verifyToken = async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET,
      function (err, decode) {
        if (err) req.user = undefined;
        // console.log("decode", decode);
        if (!decode) {
          return res.status(401).json({ message: "Invalid token." });
        }
        const loggedInUser = User.findOne({
          where: {
            id: decode.userId,
          },
        })
          .then((user) => {
            if (!user) {
              return res.status(500).json({
                message: "User doesnt exist",
              });
            }
            req.user = user;
            next();
          })
          .catch((err) => {
            res.status(500).json({
              message: "Network Error",
            });
          });
      }
    );
  } else {
    req.user = undefined;
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }
};
module.exports = verifyToken;
