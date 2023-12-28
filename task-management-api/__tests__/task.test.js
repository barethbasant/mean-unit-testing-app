const supertest = require("supertest");
const { app } = require("../app");
const request = supertest(app);
const { sequelize, Task } = require("../models");

describe("Task API", () => {
  let taskId;
  let accessToken;
  const userData = {};
  it(`POST /register should return 200 and create a new User`, async () => {
    userData.email = "basant1224@test.com";
    userData.password = "1234";
    userData.fullName = "basant1224";
    const response = await request.post("/register").send(userData);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.message).toBe("User Registration Done");
  });

  it(`POST /login should return 200 and login should be success with access and refreshToken`, async () => {
    userData.email = "basant1224@test.com";
    userData.password = "1234";
    const response = await request.post("/login").send(userData);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.message).toBe("Login Successfully");
    accessToken = response.body.accessToken;
  });
  it("POST /task should return 201 and create a new task", async () => {
    const taskData = {
      title: "Test Task",
      description: "This is a test task",
      dueDate: "2023-12-31",
      completed: false,
    };
    const response = await request
      .post("/task")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(taskData);
    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.title).toBe(taskData.title);
    expect(response.body.message).toBe("Task Added Successfully");
    taskId = response.body.data.id;
  });

  it("POST /task should not create a task without a title or empty title", async () => {
    const taskData = {
      description: "This task has no title",
      dueDate: "2023-12-31",
      completed: false,
    };
    const response = await request
      .post("/task")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(taskData);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Title is required");
    taskData.title = "";
    const response2 = await request
      .post("/task")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(taskData);
    expect(response2.status).toBe(400);
    expect(response2.body.error).toBe("Title is required");
  });

  it("POST /task should not create a task with an invalid due date format", async () => {
    const taskData = {
      title: "Invalid Due Date Task",
      description: "This task has an invalid due date format",
      dueDate: "invalid-format",
      completed: false,
    };
    const response = await request
      .post("/task")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(taskData);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Due date must be in the format YYYY-MM-DD"
    );
  });

  it("GET /task/taskId should return 200 and details of the task", async () => {
    // console.log("taskid", taskId);
    const response = await request
      .get(`/task/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();
    // console.log(response.status);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.data).toBeDefined();
  });

  it("GET /task/taskId should handle fetching a nonexistent task", async () => {
    const response = await request
      .get("/task/nonexistent-id")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No Task Found");
    // expect(response.body.data).toBe("No Task Found");
  });

  it("GET /task should return 200 and list of tasks", async () => {
    const response = await request
      .get("/task")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.data).toBeDefined();
  });

  it("PUT /task/taskId should not update a task with an unwanted id", async () => {
    const invalidTitleTaskData = {
      title: "updated title",
      description: "This task has an empty title",
      dueDate: "2023-12-31",
      completed: false,
    };

    const response = await request
      .put(`/task/abcdef`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(invalidTitleTaskData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No Task Found");
  });

  it("PUT /task/taskId should not update a task with an empty title", async () => {
    const invalidTitleTaskData = {
      title: "",
      description: "This task has an empty title",
      dueDate: "2023-12-31",
      completed: false,
    };

    const response = await request
      .put(`/task/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(invalidTitleTaskData);

    // console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Title is required");
  });

  it(`PUT /task/taskId should return 200 and update task`, async () => {
    const updatedTaskData = {
      title: "Updated Task",
      description: "This task has been updated",
      dueDate: "2024-01-15",
      completed: true,
    };

    const response = await request
      .put(`/task/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedTaskData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Updated Task Successfully");
    expect(response.body.data).toBeDefined();
  });

  it("PUT /task/taskId should not update a task with an invalid due date format", async () => {
    const invalidDueDateTaskData = {
      title: "Invalid Due Date Task",
      description: "This task has an invalid due date format",
      dueDate: "invalid-format",
      completed: false,
    };

    const response = await request
      .put(`/task/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(invalidDueDateTaskData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Due date must be in the format YYYY-MM-DD"
    );
  });

  it("DELETE /task/taskId should handle deleting a nonexistent task", async () => {
    const nonexistentTaskId = "nonexistent-id";
    const response = await request
      .delete(`/task/${nonexistentTaskId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(404);
  });

  it(`DELETE /task/taskId should return 200 and delete a task`, async () => {
    const response = await request
      .delete(`/task/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Deleted Task Successfully");
  });
});
