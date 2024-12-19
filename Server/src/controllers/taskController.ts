import { Request, Response } from "express";
import { db } from "../config/db";
import { Task } from "../models/task";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM tasks");
    const tasks: Task[] = rows as Task[];

    if (tasks.length === 0) {
      res.status(200).json({ message: "Tasks not found" });
    } else {
      res.status(200).json(tasks);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const task: Task = req.body;
  console.log(task);
  try {
    await db
      .promise()
      .query(
        "INSERT INTO tasks (titleName, description, status, startDate, endDate) VALUES (?, ?, ?, ?, ?)",
        [
          task.titleName,
          task.description,
          task.status,
          task.startDate,
          task.endDate,
        ]
      );
    res.status(201).json({ message: "Task created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const id = req.params.id;
  const task: Task = req.body;

  try {
    await db
      .promise()
      .query("UPDATE tasks SET ? WHERE idTasks = ?", [task, id]);
    res.status(200).json({ message: "Task updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTasks = async (req: Request, res: Response) => {
  try {
    await db.promise().query("DELETE FROM tasks WHERE status = 'finished'");
    res.status(200).json({ message: "Tasks deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
