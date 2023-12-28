const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const userService = require("../services/userService");
const {
  dataForAccessToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/authJWT");

exports.registerUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleValidationErrors(res, errors);
  }

  const { fullName, email, password } = req.body;
  const userData = {
    fullName,
    email,
    password,
  };

  const isuserAdded = await userService.findByEmailOrID(null, email);

  if (isuserAdded) {
    return res.status(401).json({ error: "User Already Exists", data: {} });
  }

  const user = await userService.registerUser(userData);
  delete user.password;
  res.status(200).json({
    message: "User Registration Done",
    data: user,
  });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleValidationErrors(res, errors);
  }
  const { email, password } = req.body;
  const loggedInUser = await userService.loginUser(email, password);
  if (!loggedInUser) {
    throw Error("Invalid Credentials");
  }
  const dataForToken = dataForAccessToken(loggedInUser);
  const accessToken = await generateAccessToken(dataForToken);
  const refreshToken = await generateRefreshToken(dataForToken);
  res
    .status(200)
    // .cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   sameSite: "strict",
    // })
    // .header("Authorization", accessToken)
    .json({
      message: "Login Successfully",
      data: loggedInUser,
      accessToken,
      refreshToken,
    });
});

const handleValidationErrors = (
  res,
  errors,
  statusCode = 400,
  message = "Validation Error"
) => {
  // console.log(errors.array()[0].msg === "Task not found");
  if (errors.array()[0].msg === "User not found") {
    return handleNotFoundError(res, errors);
  } else {
    return res
      .status(statusCode)
      .json({ errors: errors.array(), error: errors.array()[0].msg, message });
  }
};

const handleNotFoundError = (res, errors) => {
  return res.status(404).json({
    errors: errors.array(),
    error: errors.array()[0].msg,
    message: "No Task Found",
  });
};
