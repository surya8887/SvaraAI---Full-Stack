import * as taskRepo from "../repositories/task.repository.js";
import ApiError from "../utils/ApiError.js";

export const createTaskService = async (payload) => {
  const { title, projectId } = payload;
  if (!title || !projectId) throw new ApiError(400, "Title and projectId required");
  return taskRepo.createTaskRepo(payload);
};

export const updateTaskService = async (taskId, updates) => {
  const updated = await taskRepo.updateTaskRepo(taskId, updates);
  if (!updated) throw new ApiError(404, "Task not found");
  return updated;
};

export const deleteTaskService = async (taskId) => {
  const deleted = await taskRepo.deleteTaskRepo(taskId);
  if (!deleted) throw new ApiError(404, "Task not found");
  return deleted;
};

export const getTasksByProjectService = async ({ projectId, status, priority, startDate, endDate, page = 1, limit = 10 }) => {
  const filters = { projectId };
  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  if (startDate || endDate) {
    filters.deadline = {};
    if (startDate) filters.deadline.$gte = new Date(startDate);
    if (endDate) filters.deadline.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const tasks = await taskRepo.findTasks(filters, { skip, limit: parseInt(limit, 10) });
  const total = await taskRepo.countTasks(filters);
  return { tasks, pagination: { total, page: parseInt(page, 10), limit: parseInt(limit, 10), totalPages: Math.ceil(total / limit) } };
};
