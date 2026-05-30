import { Router } from "express";

import {
  checkSlugAvailability,
  createReservedSlug,
  updateReservedSlug,
  deleteReservedSlug,
  getReservedSlugs,
  getReservedSlugByCode
} from "../controllers/slug.controller.js";

import { getPortfolioCode } from "../middlewares/portfolioCode.middleware.js";
import { validateSlug } from "../middlewares/slug.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authenticateRole } from "../middlewares/role.middleware.js";
import {slugValidation, validate, commonValidation} from '../validator/index.js'

import {Roles, UniqueCodePrefixes} from '../constants/constants.js'
    
const router = Router();

router.post(
  "/validate",
  validateSlug,
    slugValidation.createReservedSlugValidation(),
    validate,
  checkSlugAvailability
);

router.post(
    "/createReservedSlug",
    authenticateUser,
    authenticateRole([Roles.SUPERADMIN]),
    slugValidation.createReservedSlugValidation(),
    validate,
    createReservedSlug
);

router.put(
    "/:uniqueCode",
    authenticateUser,
    authenticateRole([Roles.SUPERADMIN]),
    commonValidation.validateUniqueCode(UniqueCodePrefixes.ReservedSlug),
    slugValidation.updateReservedSlugValidation(),
    validate,
    updateReservedSlug
);

router.delete(
    "/:uniqueCode",
    authenticateUser,
    authenticateRole([Roles.SUPERADMIN]),
    commonValidation.validateUniqueCode(UniqueCodePrefixes.ReservedSlug),
    validate,
    deleteReservedSlug
);

router.get(
    "/",
    authenticateUser,
    authenticateRole([Roles.SUPERADMIN]),
    getReservedSlugs
);

router.get(
    "/:uniqueCode",
    authenticateUser,
    authenticateRole([Roles.SUPERADMIN]),
    commonValidation.validateUniqueCode(UniqueCodePrefixes.ReservedSlug),
    validate,
    getReservedSlugByCode
);

export default router;