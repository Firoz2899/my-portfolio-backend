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
import { experienceValidation, validate } from "../validators/index.js";
    
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
  experienceValidation.updateExperienceValidation(),
  validate,
  updateExperience
);

router.delete(
  "/:uniqueCode",
  authenticateUser,
  getPortfolioCode,
  deleteExperience
);

router.get(
  "/details/:uniqueCode",
  getPortfolioCode,
  getExperienceByCode
);

router.get(
  "/portfolio-experiences",
  getPortfolioCode,
  getAllExperiences
);

export default router;