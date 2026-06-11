
import { ApiError, asyncHandler } from "#utils/index.js";
import {ErrorTypes} from '#constants/constants.js'
import ProfileModel from "#models/profile.model.js";

export const getProfileCode = asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Unauthorized request", ErrorTypes.UNAUTHORIZED)
    }

    const profileData = await ProfileModel.findOne({
        UserUniqueCode: req.user.UniqueCode,
    }).select("UniqueCode");

    const profileCode = profileData?.UniqueCode;

    if (!profileCode) {
        throw new ApiError(404, "Profile not found", ErrorTypes.NOT_FOUND)
    }

    req.profileCode = profileCode;

    next()
});