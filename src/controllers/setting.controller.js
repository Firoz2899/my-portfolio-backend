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
                DefaultPortfolioUniqueCode: ""
            });
    }

    return new ApiResponse(
        200,
        settings
    );
});

import Portfolio from "../models/portfolio.model.js";

export const updateDefaultPortfolio = asyncHandler(async (req) => {

    const { portfolioCode } = req.params;

    const portfolio = await Portfolio.findOne({
        UniqueCode: portfolioCode
    });

    if (!portfolio) {
        throw new ApiError(
            404,
            "Portfolio not found",
            ErrorTypes.NOT_FOUND
        );
    }

    let settings = await SiteSettingModel.findOne();

    if (!settings) {
        settings = await SiteSettingModel.create({
            DefaultPortfolioUniqueCode: portfolioCode
        });
    } else {
        settings.DefaultPortfolioUniqueCode = portfolioCode;

        await settings.save();
    }

    return new ApiResponse(
        200,
        settings,
        "Default portfolio updated successfully"
    );
});

export const deleteDefaultPortfolio = asyncHandler(async (req) => {

    const settings = await SiteSettingModel.findOneAndDelete({});

    if (!settings) {
        throw new ApiError(404, "Default portfolio not found", ErrorTypes.NOT_FOUND);
    }
    
    return new ApiResponse(
        200,
        result,
        "Default portfolio deleted successfully"
    );
});