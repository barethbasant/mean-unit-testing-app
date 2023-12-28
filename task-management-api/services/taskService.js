const asyncHandler = require("express-async-handler");
const { Task } = require("../models");

exports.findTaskByIdOrStatus = asyncHandler(
  async (id, title = null, isCompleted = null) => {
    const where = {};

    if (id) {
      where.id = id;
    }
    if (title && completed) {
      where.title = title;
      where.completed = isCompleted;
    }

    return Task.findOne({
      where,
    });
  }
);

exports.createTask = asyncHandler(async (data) => {
  return Task.create(data);
});

exports.getTasks = asyncHandler(async () => {
  return Task.findAll({
    order: [["id", "DESC"]],
  });
});

exports.updateTask = asyncHandler(async (dataToUpdate, id) => {
  return Task.update(dataToUpdate, {
    where: {
      id,
    },
  });
});

exports.deleteTask = asyncHandler(async (id) => {
  return Task.destroy({
    where: {
      id,
    },
  });
});
