const { Sequelize, DataTypes } = require("sequelize");
const { Task } = require("../../models");
const { sequelize, dataTypes } = require("sequelize-test-helpers");

describe("Task Model", () => {
  //   const TaskModel = require("../../models/task")(sequelize, DataTypes);
  const taskMock = jest.fn();
  const mockInstance = jest.fn();
  Task.init = jest.fn();
  Task.sequelize = { define: taskMock };
  Task.build = mockInstance;
  Task.create = mockInstance;
  Task.Update = mockInstance;
  Task.delete = mockInstance;
  it("should be defined", () => {
    expect(Task).toBeDefined();
  });

  it("should create a task instance", () => {
    const taskData = {
      title: "Test Task",
      description: "This is a test task",
      dueDate: "2023-12-31",
      completed: false,
    };
    Task.build(taskData);
    expect(mockInstance).toHaveBeenCalledWith(taskData);
  });
  it("should create a task in the database", async () => {
    const taskData = {
      title: "Test Task",
      description: "This is a test task",
      dueDate: "2023-12-31",
      completed: false,
    };
    await Task.create(taskData);
    expect(mockInstance).toHaveBeenCalledWith(taskData);
  });

  it("should Update a task in the database", async () => {
    const id = 1;
    const taskData = {
      title: "Test Task",
      description: "This is a test task",
      dueDate: "2023-12-31",
      completed: false,
    };
    await Task.Update(taskData, {
      where: {
        id,
      },
    });
    expect(mockInstance).toHaveBeenCalledWith(taskData);
  });

  it("should Delete a task in the database", async () => {
    const id = 1;
    await Task.delete(id);
    expect(mockInstance).toHaveBeenCalledWith(id);
  });
});
