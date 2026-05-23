import { Router } from "express";

import {
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillByCode,
  getSkillsByPortfolio
}
from "../controllers/skill.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getPortfolioCode } from "../middlewares/portfolioCode.middleware.js";

const router = Router();

router.post(
  "/",
  authenticateUser,
  getPortfolioCode,
  createSkill
);

router.put(
  "/:uniqueCode",
    authenticateUser,
    getPortfolioCode,
  updateSkill
);

router.delete(
  "/:uniqueCode",
  authenticateUser,
  getPortfolioCode,
  deleteSkill
);

router.get(
  "/details/:uniqueCode",
  getPortfolioCode,
  getSkillByCode
);

router.get(
  "/portfolio-skills",
  getPortfolioCode,
  getSkillsByPortfolio
);

export default router;