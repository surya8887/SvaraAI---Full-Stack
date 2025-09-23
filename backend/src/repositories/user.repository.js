import User from "../models/user.model.js";

export const createUser = (payload) => User.create(payload);
export const findUserByEmail = (email) => User.findOne({ email });
export const findUserById = (id) => User.findById(id);
export const updateUserRefreshToken = (userId, refreshToken) =>
  User.findByIdAndUpdate(
    userId,
    { refreshToken },
    { new: true, runValidators: false }
  );
export const clearUserRefreshToken = (userId) =>
  User.findByIdAndUpdate(
    userId,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
