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
    
const router = Router();

router.post(
  "/",
  authenticateUser,
  getPortfolioCode,
  createExperience
);

router.put(
  "/:uniqueCode",
  authenticateUser,
  getPortfolioCode,
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