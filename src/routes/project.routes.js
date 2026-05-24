import { Router } from "express";

import {
    createProject,
    updateProject,
    deleteProject,
    getProjectByCode,
    getAllProjects,
    getProjectBySlug,
    uploadProjectImages,
    uploadCoverImage,
    replaceProjectImage,
    deleteProjectImage
}
from "../controllers/project.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

import { getPortfolioCode } from "../middlewares/portfolioCode.middleware.js";

import { uploadImageInMemory } from "../utils/fileService.js";

const router = Router();

router.post(
    "/",
    authenticateUser,
    getPortfolioCode,
    createProject
);

router.put(
    "/:projectCode",
    authenticateUser,
    getPortfolioCode,
    updateProject
);

router.delete(
    "/:projectCode",
    authenticateUser,
    getPortfolioCode,
    deleteProject
);

router.get(
    "/details/:projectCode",
    getPortfolioCode,
    getProjectByCode
);

router.get(
    "/portfolio-projects",
    getPortfolioCode,
    getAllProjects
);

router.get(
    "/slug/:slug",
    getProjectBySlug
);

router.post(
    "/:projectCode/upload-cover",
    authenticateUser,
    getPortfolioCode,
    uploadImageInMemory.single("image"),
    uploadCoverImage
);

router.post(
    "/:projectCode/upload-images",
    authenticateUser,
    getPortfolioCode,
    uploadImageInMemory.array("images", 20),
    uploadProjectImages
);

router.post(
    "/:projectCode/update-slug",
    authenticateUser,
    getPortfolioCode,
    updateProjectSlug
);

router.put(
    "/:projectCode/images/:imageCode/replace",
    authenticateUser,
    getPortfolioCode,
    uploadImageInMemory.single("image"),
    replaceProjectImage
);

router.delete(
    "/:projectCode/images/:imageCode",
    authenticateUser,
    getPortfolioCode,
    deleteProjectImage
);

export default router;