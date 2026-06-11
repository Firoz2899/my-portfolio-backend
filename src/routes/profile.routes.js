import { Router } from "express";

import {
    getProfile,
    updateProfile,
    uploadProfileImage,
    uploadCoverImage,
    deleteProfileImage,
    deleteCoverImage,
    getProfileBySlug,
    updateProfileSlug,
    getDefaultProfile
}
from "#controllers/profile.controller.js";

import { authenticateUser } from "#middlewares/auth.middleware.js";

import {uploadImageInMemory} from "#utils/fileService.js"
import { commonValidation, profileValidation, validate } from "#validator/index.js";
import {UniqueCodePrefixes} from '#constants/constants.js'

const router = Router();


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/slug/:slug",
    profileValidation.updateProfileSlugValidation(),
    validate,
    getProfileBySlug
);

router.get(
    "/default-profile",
    getDefaultProfile
);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authenticateUser,
    getProfile
);

router.put(
    "/",
    authenticateUser,
    profileValidation.updateProfileValidation(),
    validate,
    updateProfile
);

router.put(
    "/slug/:slug",
    authenticateUser,
    profileValidation.updateProfileSlugValidation(),
    validate,
    updateProfileSlug
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
