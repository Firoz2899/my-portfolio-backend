import { Router } from "express";

import {
    getSiteSettings,
    updateDefaultPortfolio,
    deleteDefaultPortfolio
}
from "../controllers/setting.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authenticateRole } from "../middlewares/role.middleware.js";

import { commonValidation, siteSettingValidation, validate } from "../validator/index.js";
import {Roles, UniqueCodePrefixes} from '../constants/constants.js'

const router = Router();

const superAdminRoleAuth = authenticateRole(Roles.SUPERADMIN);

router.get(
    "/",
    authenticateUser,
    superAdminRoleAuth,
    getSiteSettings
);

router.put(
    "/:portfolioCode",
    authenticateUser,
    superAdminRoleAuth,
    commonValidation.validateUniqueCode(UniqueCodePrefixes.Portfolio, "portfolioCode"),
    validate,
    updateDefaultPortfolio
);

router.delete(
    "/:portfolioCode",
    authenticateUser,
    superAdminRoleAuth,
    commonValidation.validateUniqueCode(UniqueCodePrefixes.Portfolio, "portfolioCode"),
    validate,
    deleteDefaultPortfolio
);

export default router;
