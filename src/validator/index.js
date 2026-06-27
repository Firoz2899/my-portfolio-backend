import { validationResult } from "express-validator";
import { ApiError, asyncHandler } from "../utils/index.js";
import { ErrorTypes } from "#src/constants/constants.js";

export const validate = asyncHandler((req, res, next) => {
  const errors = validationResult(req);
  console.log("🚀 ~ index.js:7 ~ errors:", errors);
  if (errors.isEmpty()) {
    return next();
  }
  const error = errors.array().map((item, i) => ({[item.path] : item.msg}))
  throw new ApiError(422, "Received data is not valid", ErrorTypes.VALIDATION_ERROR, error);
});


//#region FileValidation
export * as commonValidation from './common.validation.js'
export * as authValidation from './auth.validation.js'
export * as profileValidation from "./profile.validation.js";
export * as skillValidation from "./skill.validation.js";
export * as teamMemberValidation from "./teamMember.validation.js";
export * as educationValidation from "./education.validation.js";
export * as experienceValidation from "./experience.validation.js";
export * as serviceValidation from "./service.validation.js";
export * as projectValidation from "./project.validation.js";
export * as slugValidation from "./slug.validation.js";
export * as siteSettingValidation from "./siteSetting.validation.js";
//#endregion