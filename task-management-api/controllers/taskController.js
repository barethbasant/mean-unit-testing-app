const asyncHandler = require("express-async-handler");
const taskService = require("../services/taskService");
const { validationResult } = require("express-validator");

exports.createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleValidationErrors(res, errors);
  }

  const { title, description, dueDate, completed } = req.body;
  const dataTonsert = {
    title,
    description,
    dueDate,
    completed,
  };

  const task = await taskService.createTask(dataTonsert);
  res.status(201).json({
    message: "Task Added Successfully",
    data: task,
  });
});

exports.getTasks = asyncHandler(async (req, res) => {
  // console.log("get all tasks");
  const tasks = await taskService.getTasks();
  res.status(200).json({
    message: "success",
    data: tasks,
  });
});

exports.getTask = asyncHandler(async (req, res) => {
  // console.log("get task is calling", req.params.id);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleNotFoundError(res, errors);
  }
  const task = await taskService.findTaskByIdOrStatus(req.params.id);
  res.status(200).json({
    message: "success",
    data: task,
  });
});

exports.updateTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleValidationErrors(res, errors);
  }

  const { title, description, dueDate, completed } = req.body;
  const dataToUpdate = {
    title,
    description,
    dueDate,
    completed,
  };
  const task = await taskService.updateTask(dataToUpdate, req.params.id);
  res.status(200).json({ message: "Updated Task Successfully", data: {} });
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleNotFoundError(res, errors);
  }
  const id = req.params.id;
  await taskService.deleteTask(id);
  res.status(200).json({ message: "Deleted Task Successfully" });
});

const handleValidationErrors = (
  res,
  errors,
  statusCode = 400,
  message = "Validation Error"
) => {
  // console.log(errors.array()[0].msg === "Task not found");
  if (errors.array()[0].msg === "Task not found") {
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
