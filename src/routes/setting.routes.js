import { Router } from "express";

import {
    getSiteSettings,
    updateDefaultProfile,
    deleteDefaultProfile
}
from "#controllers/setting.controller.js";

import { authenticateUser } from "#middlewares/auth.middleware.js";
import { authenticateRole } from "#middlewares/role.middleware.js";

import { commonValidation, siteSettingValidation, validate } from "#validator/index.js";
import {Roles, UniqueCodePrefixes} from '#constants/constants.js'

const router = Router();

const superAdminRoleAuth = authenticateRole(Roles.SUPERADMIN);

router.get(
    "/",
    authenticateUser,
    superAdminRoleAuth,
    getSiteSettings
);

router.put(
    "/:profileCode",
    authenticateUser,
    superAdminRoleAuth,
    commonValidation.validateUniqueCode(UniqueCodePrefixes.Profile, "profileCode"),
    validate,
    updateDefaultProfile
);

router.delete(
    "/:profileCode",
    authenticateUser,
    superAdminRoleAuth,
    commonValidation.validateUniqueCode(UniqueCodePrefixes.Profile, "profileCode"),
    validate,
    deleteDefaultProfile
);

export default router;
