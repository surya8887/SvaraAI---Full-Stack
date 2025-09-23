import Task from "../models/task.model.js";

export const createTaskRepo = (payload) => Task.create(payload);
export const updateTaskRepo = (taskId, updates) =>
  Task.findByIdAndUpdate(taskId, updates, { new: true, runValidators: true });
export const deleteTaskRepo = (taskId) => Task.findByIdAndDelete(taskId);
export const findTasks = (filter, options = {}) =>
  Task.find(filter)
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 10);
export const countTasks = (filter) => Task.countDocuments(filter);
export const findTaskById = (taskId) => Task.findById(taskId);
