import { Router } from "express";

import {
  createExperience,
  updateExperience,
  deleteExperience,
  getExperienceByCode,
  getAllExperiences
} from "../controllers/experience.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getProfileCode } from "../middlewares/profileCode.middleware.js";
import { experienceValidation, validate, commonValidation } from "../validator/index.js";
import {UniqueCodePrefixes} from '../constants/constants.js'
    
const router = Router();

router.post(
  "/",
  authenticateUser,
  getProfileCode,
  experienceValidation.createExperienceValidation(),
  validate,
  createExperience
);

router.put(
  "/:uniqueCode",
  authenticateUser,
  getProfileCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Experience),
  validate,
  updateExperience
);

router.delete(
  "/:uniqueCode",
  authenticateUser,
  getProfileCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Experience),
  validate,
  deleteExperience
);

router.get(
  "/details/:uniqueCode",
  getProfileCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Experience),
  validate,
  getExperienceByCode
);

router.get(
  "/profile-experiences",
  getProfileCode,
  getAllExperiences
);

export default router;