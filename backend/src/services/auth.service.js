import * as userRepo from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import { generateTokensAndPersist } from "../utils/generateToken.js";

export const signupService = async ({ username, email, password }) => {
  if (!username || !email || !password) throw new ApiError(400, "All fields are required");
  const exists = await userRepo.findUserByEmail(email);
  if (exists) throw new ApiError(400, "User already exists");
  const user = await userRepo.createUser({ username, email, password });
  return user;
};

export const loginService = async ({ email, password }) => {
  if (!email || !password) throw new ApiError(400, "Email and password required");
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new ApiError(400, "Invalid credentials");
  const match = await user.comparePassword(password);
  if (!match) throw new ApiError(400, "Invalid credentials");

  // generate tokens and persist refreshToken
  const { accessToken, refreshToken } = await generateTokensAndPersist(user);
  const safeUser = await userRepo.findUserById(user._id).select("-password -refreshToken");
  return { accessToken, refreshToken, user: safeUser };
};

export const logoutService = async (userId) => {
  await userRepo.clearUserRefreshToken(userId);
};
