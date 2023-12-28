const { body, param } = require("express-validator");
const validator = require("validator");
const { Task, User } = require("../models");

const validationMiddleware = {
  validateTaskCreation: [
    body("description").isString().withMessage("Description must be a string"),
    body("dueDate")
      .custom((value, { req }) => {
        if (req.body.dueDate && !validator.toDate(value)) {
          throw new Error("Due date must be in the format YYYY-MM-DD");
        }
        return true;
      })
      .notEmpty()
      .withMessage("Due date is required"),
    body("completed").isBoolean().withMessage("Completed must be a boolean"),
    body("title").notEmpty().withMessage("Title is required"),
  ],
  validateTaskId: [
    param("id").custom(async (value) => {
      const task = await Task.findOne({ where: { id: value } });
      if (!task) {
        throw new Error("Task not found");
      }
      return true;
    }),
    // .isInt()
    // .withMessage("TaskId must be an integer"),
  ],
  validateUserRegistration: [
    body("fullName").isString().withMessage("Please Enter FullName"),
    body("email").isEmail().withMessage("Please Enter a valid Email"),
    body("password").isString().withMessage("Please Enter Password"),
  ],
  validateUserLogin: [
    body("email").isEmail().withMessage("Please Enter a valid Email"),
    body("password").isString().withMessage("Please Enter Password"),
  ],
  validateEmailRegistration: [
    param("email").custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("User Already Exists");
      }

      return true;
    }),
  ],
};

module.exports = validationMiddleware;
