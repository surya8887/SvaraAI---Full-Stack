import ApiError from "../utils/ApiError.js";

export default (err, req, res, next) => {
  console.error(err);
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ status: "error", message: err.message, data: err.data || {} });
  } else {
    res.status(500).json({ status: "error", message: err.message || "Internal Server Error" });
  }
};
