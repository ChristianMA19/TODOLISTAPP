import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTasks,
} from "../controllers/taskController";

const router = express.Router();

router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks", deleteTasks);

export default router;
