import jwt from "jsonwebtoken";
import * as userRepo from "../repositories/user.repository.js";

/**
 * Generates access & refresh tokens for a user and persists the refreshToken in DB.
 * Accepts either a user document OR userId. If user is supplied we call its methods,
 * otherwise we look it up.
 */
export const generateTokensAndPersist = async (userOrId) => {
  let user = userOrId;
  if (!user._id) {
    user = await userRepo.findUserById(userOrId);
  }

  const accessToken = jwt.sign(
    { userId: user._id, username: user.username, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );

  // persist refresh token
  await userRepo.updateUserRefreshToken(user._id, refreshToken);
  return { accessToken, refreshToken };
};

export const setTokenCookies = (res, accessToken, refreshToken) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };
  res.cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 });
};
