import Project from "../models/project.model.js";

export const createProjectRepo = (payload) => Project.create(payload);
export const findProjectsByOwner = (ownerId) =>
  Project.find({ owner: ownerId }).sort({ createdAt: -1 });
export const findProjectById = (id) => Project.findById(id);
export const deleteProjectById = (id) => Project.findByIdAndDelete(id);
export const deleteProjectByIdAndOwner = (id, ownerId) =>
  Project.findOneAndDelete({ _id: id, owner: ownerId });
