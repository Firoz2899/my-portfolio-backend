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
import { skillValidation, validate, commonValidation } from "../validator/index.js";
import {UniqueCodePrefixes} from '../constants/constants.js'

const router = Router();

router.post(
  "/",
  authenticateUser,
  getPortfolioCode,
  skillValidation.createSkillValidation(),
  validate,
  createSkill
);

router.put(
  "/:uniqueCode",
    authenticateUser,
    getPortfolioCode,
    commonValidation.validateUniqueCode(UniqueCodePrefixes.Skill),
    validate,
  updateSkill
);

router.delete(
  "/:uniqueCode",
  authenticateUser,
  getPortfolioCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Skill),
  validate,
  deleteSkill
);

router.get(
  "/details/:uniqueCode",
  getPortfolioCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Skill),
  validate,
  getSkillByCode
);

router.get(
  "/portfolio-skills",
  getPortfolioCode,
  getSkillsByPortfolio
);

export default router;