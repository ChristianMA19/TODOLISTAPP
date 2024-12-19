import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTasks,
  getTask,
} from "../controllers/taskController";

const router = express.Router();

router.get("/tasks", getTasks);
router.get("/task/:id", getTask);
router.post("/tasks", createTask);
router.put("/tasks/:id", updateTask);
router.delete("/task/:id", deleteTasks);

export default router;
