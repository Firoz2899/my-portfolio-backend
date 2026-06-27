import { Router } from "express";

import {
  createEducation,
  updateEducation,
  deleteEducation,
  getEducationByCode,
  getAllEducations
} from "#controllers/education.controller.js";

import { authenticateUser } from "#middlewares/auth.middleware.js";
import { getProfileCode } from "#middlewares/profileCode.middleware.js";
import {
  educationValidation,
  validate,
  commonValidation
} from "#validator/index.js";

import { UniqueCodePrefixes } from "#constants/constants.js";

const router = Router();

router.post(
  "/",
  authenticateUser,
  getProfileCode,
  educationValidation.createEducationValidation(),
  validate,
  createEducation
);

router.put(
  "/:uniqueCode",
  authenticateUser,
  getProfileCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Education),
  educationValidation.createEducationValidation(),
  validate,
  updateEducation
);

router.delete(
  "/:uniqueCode",
  authenticateUser,
  getProfileCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Education),
  validate,
  deleteEducation
);

router.get(
  "/details/:uniqueCode",
  getProfileCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Education),
  validate,
  getEducationByCode
);

router.get(
  "/profile-educations",
  getProfileCode,
  getAllEducations
);

export default router;