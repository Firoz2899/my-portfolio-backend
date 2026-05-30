import { validationResult } from "express-validator";
import { ApiError, asyncHandler } from "../utils/index.js";

export const validate = asyncHandler((req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const error = errors.array().map((item, i) => ({[item.path] : item.msg}))
  throw new ApiError(422, "Received data is not valid", error);
});


//#region FileValidation
export * as commonValidation from './common.validation.js'
export * as authValidation from './auth.validation.js'
export * as portfolioValidation from "./portfolio.validation.js";
export * as skillValidation from "./skill.validation.js";
export * as experienceValidation from "./experience.validation.js";
export * as serviceValidation from "./service.validation.js";
export * as projectValidation from "./project.validation.js";
export * as slugValidation from "./slug.validation.js";
export * as siteSettingValidation from "./siteSetting.validation.js";
//#endregion