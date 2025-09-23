import express from "express";
import { createProject, listProjects, deleteProject } from "../controllers/project.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, listProjects);
router.delete("/:projectId", authMiddleware, deleteProject);
export default router;

