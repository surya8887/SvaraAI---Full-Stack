import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as projectService from "../services/project.service.js";

export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const owner = req.user.userId;
  const project = await projectService.createProjectService({ name, description, owner });
  res.status(201).json(new ApiResponse(201, project, "Project created"));
});

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.listProjectsService(req.user.userId);
  res.status(200).json(new ApiResponse(200, projects, "Projects fetched"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  await projectService.deleteProjectService(projectId, req.user.userId);
  res.status(200).json(new ApiResponse(200, {}, "Project deleted"));
});
