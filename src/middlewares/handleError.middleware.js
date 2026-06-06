import mongoose from "mongoose";
import {ApiError, removeUnusedMulterImageFilesOnError} from '../utils/index.js';
import {ErrorTypes} from '../constants/constants.js'

export const handleError = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    const errorType = error instanceof mongoose.Error ? ErrorTypes.DATABASE_ERROR : ErrorTypes.UNKNOWN_ERROR;

    const message = (error.name === 'TokenExpiredError')
                        ? "Access Token was Expire" 
                        : (error.name === 'JsonWebTokenError')
                        ? "Access Token was invalid" 
                        :( error.message || "Something went wrong")

    error = new ApiError(statusCode, message, errorType, error?.errors || [], err.stack);
  }

  const response = {
    IsSuccess: false,
    statusCode: statusCode,
    Message: error.message,
    Data: error.data,
    Errors: error.errors,
    ErrorType: error.errorType
    // ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Error stack traces should be visible in development for debugging
  };

  removeUnusedMulterImageFilesOnError(req);
  return res.status(error.statusCode).json(response);
};