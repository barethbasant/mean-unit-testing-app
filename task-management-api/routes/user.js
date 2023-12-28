const express = require("express");
const userController = require("../controllers/userController");
const {
  validateUserRegistration,
  validateUserLogin,
  validateEmailRegistration,
} = require("../middlewares/validationMiddleware");
const router = express.Router();

router.post("/register", validateUserRegistration, userController.registerUser);
router.post("/login", validateUserLogin, userController.loginUser);

module.exports = router;
