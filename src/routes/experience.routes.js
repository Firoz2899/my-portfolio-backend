import { Router } from "express";

import {
  createExperience,
  updateExperience,
  deleteExperience,
  getExperienceByCode,
  getAllExperiences
} from "../controllers/experience.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getPortfolioCode } from "../middlewares/portfolioCode.middleware.js";
import { experienceValidation, validate, commonValidation } from "../validator/index.js";
import {UniqueCodePrefixes} from '../constants/constants.js'
    
const router = Router();

router.post(
  "/",
  authenticateUser,
  getPortfolioCode,
  experienceValidation.createExperienceValidation(),
  validate,
  createExperience
);

router.put(
  "/:uniqueCode",
  authenticateUser,
  getPortfolioCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Experience),
  validate,
  updateExperience
);

router.delete(
  "/:uniqueCode",
  authenticateUser,
  getPortfolioCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Experience),
  validate,
  deleteExperience
);

router.get(
  "/details/:uniqueCode",
  getPortfolioCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Experience),
  validate,
  getExperienceByCode
);

router.get(
  "/portfolio-experiences",
  getPortfolioCode,
  getAllExperiences
);

export default router;