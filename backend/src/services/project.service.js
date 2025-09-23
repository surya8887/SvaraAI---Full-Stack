import * as projectRepo from "../repositories/project.repository.js";
import ApiError from "../utils/ApiError.js";

export const createProjectService = async ({ name, description, owner }) => {
  if (!name) throw new ApiError(400, "Project name required");
  return projectRepo.createProjectRepo({ name, description, owner });
};

export const listProjectsService = async (owner) => {
  return projectRepo.findProjectsByOwner(owner);
};

export const deleteProjectService = async (projectId, owner) => {
  const deleted = await projectRepo.deleteProjectByIdAndOwner(projectId, owner);
  if (!deleted) throw new ApiError(404, "Project not found or not authorized");
  return deleted;
};
