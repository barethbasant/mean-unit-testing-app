const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const {
  validateTaskCreation,
  validateTaskId,
} = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/authJWT");

router.post("/", verifyToken, validateTaskCreation, taskController.createTask);
router.get("/:id", verifyToken, validateTaskId, taskController.getTask);
router.get("/", verifyToken, taskController.getTasks);
router.put(
  "/:id",
  verifyToken,
  validateTaskId,
  validateTaskCreation,
  taskController.updateTask
);
router.delete("/:id", verifyToken, validateTaskId, taskController.deleteTask);
module.exports = router;
