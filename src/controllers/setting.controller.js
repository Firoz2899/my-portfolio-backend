import SiteSettingModel from "../models/siteSetting.model.js";
import {
  ApiError,
  ApiResponse,
  asyncHandler
} from "../utils/index.js";

import {ErrorTypes} from '../constants/constants.js'

export const getSiteSettings = asyncHandler(async () => {

    let settings =
        await SiteSettingModel.findOne();

    if (!settings) {

        settings =
            await SiteSettingModel.create({
                DefaultProfileUniqueCode: ""
            });
    }

    return new ApiResponse(
        200,
        settings
    );
});

import ProfileModel from "../models/profile.model.js";

export const updateDefaultProfile = asyncHandler(async (req) => {

    const { profileCode } = req.params;

    const profile = await ProfileModel.findOne({
        UniqueCode: profileCode
    });

    if (!profile) {
        throw new ApiError(
            404,
            "Profile not found",
            ErrorTypes.NOT_FOUND
        );
    }

    let settings = await SiteSettingModel.findOne();

    if (!settings) {
        settings = await SiteSettingModel.create({
            DefaultProfileUniqueCode: profileCode
        });
    } else {
        settings.DefaultProfileUniqueCode = profileCode;

        await settings.save();
    }

    return new ApiResponse(
        200,
        settings,
        "Default profile updated successfully"
    );
});

export const deleteDefaultProfile = asyncHandler(async (req) => {

    const settings = await SiteSettingModel.findOneAndDelete({});

    if (!settings) {
        throw new ApiError(404, "Default profile not found", ErrorTypes.NOT_FOUND);
    }
    
    return new ApiResponse(
        200,
        result,
        "Default profile deleted successfully"
    );
});