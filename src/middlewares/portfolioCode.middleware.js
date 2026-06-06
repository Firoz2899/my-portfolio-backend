
import { ApiError, asyncHandler } from "../utils/index.js";
import Portfolio from "../models/portfolio.model.js";
import {ErrorTypes} from '../constants/constants.js'

export const getPortfolioCode = asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Unauthorized request", ErrorTypes.UNAUTHORIZED)
    }

    const portfolioData = await Portfolio.findOne({
        UserUniqueCode: req.user.UniqueCode,
    }).select("UniqueCode");

    const portfolioCode = portfolioData?.UniqueCode;

    if (!portfolioCode) {
        throw new ApiError(404, "Portfolio not found", ErrorTypes.NOT_FOUND)
    }

    req.portfolioCode = portfolioCode;

    next()
});