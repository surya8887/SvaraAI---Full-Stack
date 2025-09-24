import express from "express";
import { createTask, updateTask, deleteTask, getTasksByProject,getAllTask } from "../controllers/task.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/", authMiddleware, createTask);
router.get('/',authMiddleware,getAllTask)
router.patch("/:taskId", authMiddleware, updateTask); 
router.delete("/:taskId", authMiddleware, deleteTask);
router.get("/:projectId", authMiddleware, getTasksByProject);
export default router;


