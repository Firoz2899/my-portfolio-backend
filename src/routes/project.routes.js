import { Router } from "express";

import {
    createProject,
    updateProject,
    updateProjectSlug,
    deleteProject,
    getProjectByCode,
    getAllProjects,
    getProjectBySlug,
    uploadProjectImages,
    uploadCoverImage,
    replaceProjectImage,
    deleteProjectImage
}
from "#controllers/project.controller.js";

import { authenticateUser } from "#middlewares/auth.middleware.js";

import { getProfileCode } from "#middlewares/profileCode.middleware.js";

import { uploadImageInMemory } from "#utils/fileService.js";

import { commonValidation, projectValidation, validate } from "#validator/index.js";
import {UniqueCodePrefixes} from '#constants/constants.js'

const uniqueCodeValidation = commonValidation.validateUniqueCode(UniqueCodePrefixes.Project, "projectCode");

const router = Router();

router.post(
    "/",
    authenticateUser,
    getProfileCode,
    projectValidation.createProjectValidation(),
    validate,
    createProject
);

router.put(
    "/:projectCode",
    authenticateUser,
    getProfileCode,
    uniqueCodeValidation,
    validate,
    updateProject
);

router.delete(
    "/:projectCode",
    authenticateUser,
    getProfileCode,
    uniqueCodeValidation,
    validate,
    deleteProject
);

router.get(
    "/details/:projectCode",
    getProfileCode,
    uniqueCodeValidation,
    validate,
    getProjectByCode
);

router.get(
    "/profile-projects",
    getProfileCode,
    getAllProjects
);

router.get(
    "/slug/:slug",
    getProjectBySlug
);

router.post(
    "/:projectCode/upload-cover",
    authenticateUser,
    getProfileCode,
    uploadImageInMemory.single("image"),
    uploadCoverImage
);

router.post(
    "/:projectCode/upload-images",
    authenticateUser,
    getProfileCode,
    uploadImageInMemory.array("images", 20),
    uploadProjectImages
);

router.post(
    "/:projectCode/update-slug",
    authenticateUser,
    getProfileCode,
    projectValidation.updateProjectSlugValidation(),
    validate,
    updateProjectSlug
);

router.put(
    "/:projectCode/images/:imageCode/replace",
    authenticateUser,
    getProfileCode,
    uploadImageInMemory.single("image"),
    replaceProjectImage
);

router.delete(
    "/:projectCode/images/:imageCode",
    authenticateUser,
    getProfileCode,
    deleteProjectImage
);

export default router;