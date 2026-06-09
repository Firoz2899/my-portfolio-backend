import { Router } from "express";

import {
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillByCode,
  getSkillsByProfile
}
from "../controllers/skill.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getProfileCode } from "../middlewares/profileCode.middleware.js";
import { skillValidation, validate, commonValidation } from "../validator/index.js";
import {UniqueCodePrefixes} from '../constants/constants.js'

const router = Router();

router.post(
  "/",
  authenticateUser,
  getProfileCode,
  skillValidation.createSkillValidation(),
  validate,
  createSkill
);

router.put(
  "/:uniqueCode",
    authenticateUser,
    getProfileCode,
    commonValidation.validateUniqueCode(UniqueCodePrefixes.Skill),
    validate,
  updateSkill
);

router.delete(
  "/:uniqueCode",
  authenticateUser,
  getProfileCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Skill),
  validate,
  deleteSkill
);

router.get(
  "/details/:uniqueCode",
  getProfileCode,
  commonValidation.validateUniqueCode(UniqueCodePrefixes.Skill),
  validate,
  getSkillByCode
);

router.get(
  "/profile-skills",
  getProfileCode,
  getSkillsByProfile
);

export default router;