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

import {Roles} from '../constants/constants.js'
    
const router = Router();

router.post(
  "/validate",
  validateSlug,
  checkSlugAvailability
);

router.post(
    "/createReservedSlug",
    authenticateUser,
    authenticateRole([Roles.SUPERADMIN]),
    createReservedSlug
);

router.put(
    "/:uniqueCode",
    authenticateUser,
    authenticateRole([Roles.SUPERADMIN]),
    updateReservedSlug
);

router.delete(
    "/:uniqueCode",
    authenticateUser,
    authenticateRole([Roles.SUPERADMIN]),
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
    getReservedSlugByCode
);

export default router;