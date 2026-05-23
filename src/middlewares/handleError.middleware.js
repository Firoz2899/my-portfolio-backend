import mongoose from "mongoose";
import {ApiError, removeUnusedMulterImageFilesOnError} from '../utils/index.js';

export const handleError = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    const message = (error.name === 'TokenExpiredError')
                        ? "Access Token was Expire" 
                        : (error.name === 'JsonWebTokenError')
                        ? "Access Token was invalid" 
                        :( error.message || "Something went wrong")

    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    isSuccess: false,
    message: error.message,
    data: error.data,
    errors: error.errors
    // ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
  };

  removeUnusedMulterImageFilesOnError(req);
  return res.status(error.statusCode).json(response);
};