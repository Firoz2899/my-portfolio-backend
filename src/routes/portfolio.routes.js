import { Router } from "express";

import {
    getPortfolio,
    updatePortfolio,
    uploadProfileImage,
    uploadCoverImage,
    deleteProfileImage,
    deleteCoverImage,
    getPortfolioBySlug,
    updatePortfolioSlug,
    getDefaultPortfolio
}
from "../controllers/portfolio.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

import {uploadImageInMemory} from "../utils/fileService.js"
import { commonValidation, portfolioValidation, validate } from "../validator/index.js";
import {UniqueCodePrefixes} from '../constants/constants.js'

const router = Router();


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/slug/:slug",
    portfolioValidation.updatePortfolioSlugValidation(),
    validate,
    getPortfolioBySlug
);

router.get(
    "/default-portfolio",
    getDefaultPortfolio
);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticateUser,
    getPortfolio
);

router.put(
    "/",
    authenticateUser,
    portfolioValidation.updatePortfolioValidation(),
    validate,
    updatePortfolio
);

router.put(
    "/slug/:slug",
    authenticateUser,
    portfolioValidation.updatePortfolioSlugValidation(),
    validate,
    updatePortfolioSlug
);

/*
|--------------------------------------------------------------------------
| Profile Image
|--------------------------------------------------------------------------
*/

router.post(
    "/profile-image",
    authenticateUser,
    uploadImageInMemory.single("image"),
    uploadProfileImage
);

router.delete(
    "/profile-image",
    authenticateUser,
    deleteProfileImage
);

/*
|--------------------------------------------------------------------------
| Cover Image
|--------------------------------------------------------------------------
*/

router.post(
    "/cover-image",
    authenticateUser,
    uploadImageInMemory.single("image"),
    uploadCoverImage
);

router.delete(
    "/cover-image",
    authenticateUser,
    deleteCoverImage
);

export default router;
