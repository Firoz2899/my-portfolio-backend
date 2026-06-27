import { Router } from "express";

import {
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamMemberByCode,
    getAllTeamMembers
} from "#controllers/teamMember.controller.js";

import { authenticateUser } from "#middlewares/auth.middleware.js";
import { getProfileCode } from "#middlewares/profileCode.middleware.js";
import { parseTeamMemberFormData } from "#middlewares/teamMember.middleware.js";

import { uploadImageInMemory } from "#utils/fileService.js";

import {
    teamMemberValidation,
    commonValidation,
    validate
} from "#validator/index.js";

import { UniqueCodePrefixes } from "#constants/constants.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Team Members
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticateUser,
    getProfileCode,
    uploadImageInMemory.single("image"),
    parseTeamMemberFormData,
    teamMemberValidation.createTeamMemberValidation(),
    validate,
    createTeamMember
);

router.put(
    "/:uniqueCode",
    authenticateUser,
    getProfileCode,
    uploadImageInMemory.single("image"),
    commonValidation.validateUniqueCode(
        UniqueCodePrefixes.TeamMember
    ),
    parseTeamMemberFormData,
    teamMemberValidation.createTeamMemberValidation(),
    validate,
    updateTeamMember
);

router.delete(
    "/:uniqueCode",
    authenticateUser,
    getProfileCode,
    commonValidation.validateUniqueCode(
        UniqueCodePrefixes.TeamMember
    ),
    validate,
    deleteTeamMember
);

router.get(
    "/details/:uniqueCode",
    getProfileCode,
    commonValidation.validateUniqueCode(
        UniqueCodePrefixes.TeamMember
    ),
    validate,
    getTeamMemberByCode
);

router.get(
    "/profile-team-members",
    getProfileCode,
    getAllTeamMembers
);

export default router;