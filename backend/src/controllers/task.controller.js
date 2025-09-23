import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as taskService from "../services/task.service.js";

export const createTask = asyncHandler(async (req, res) => {
  const payload = req.body;
  const task = await taskService.createTaskService(payload);
  res.status(201).json(new ApiResponse(201, task, "Task created"));
});

export const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await taskService.updateTaskService(taskId, req.body);
  res.status(200).json(new ApiResponse(200, task, "Task updated"));
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  await taskService.deleteTaskService(taskId);
  res.status(200).json(new ApiResponse(200, {}, "Task deleted"));
});

export const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status, priority, startDate, endDate, page = 1, limit = 10 } = req.query;
  const data = await taskService.getTasksByProjectService({ projectId, status, priority, startDate, endDate, page, limit });
  res.status(200).json(new ApiResponse(200, data, "Tasks fetched"));
});
