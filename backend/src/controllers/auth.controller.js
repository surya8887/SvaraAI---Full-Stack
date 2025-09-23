import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as authService from "../services/auth.service.js";
import { setTokenCookies } from "../utils/generateToken.js";

export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await authService.signupService({ username, email, password });
  const safeUser = await (await import("../repositories/user.repository.js")).findUserById(user._id).select("-password -refreshToken");
  res.status(201).json(new ApiResponse(201, safeUser, "User created successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await authService.loginService({ email, password });

  // Cookies (HTTP only)
  setTokenCookies(res, accessToken, refreshToken);

  // Return tokens as well to make integration tests / frontend easier
  res.status(200).json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
});

export const logout = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  await authService.logoutService(userId);
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" };
  return res.clearCookie("accessToken", options).clearCookie("refreshToken", options).status(200).json(new ApiResponse(200, {}, "User logged out"));
});
