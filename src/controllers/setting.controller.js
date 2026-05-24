import SiteSettingModel from "../models/siteSetting.model.js";
import {
  ApiError,
  ApiResponse,
  asyncHandler
} from "../utils/index.js";

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
            "Portfolio not found"
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