// middleware/auth.middleware.js

import jwt from "jsonwebtoken";
import User from "#models/user.model.js";
import { ApiError, config, asyncHandler } from "#utils/index.js";
import {ErrorTypes} from '#constants/constants.js'

export const authenticateUser = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
    // console.log(token);
    if (!token) {
        throw new ApiError(401, "Unauthorized request", ErrorTypes.UNAUTHORIZED)
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, config.accessTokenSecret);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access Token expired", ErrorTypes.TOKEN_EXPIRED);
        }

        throw new ApiError(401, "Invalid Access Token", ErrorTypes.INVALID_TOKEN);
    }

    const user = await User.findOne({UniqueCode: decodedToken?.UniqueCode}).select("-Password -RefreshToken -EmailOTP -EmailOTPExpiry -_id")

    if (!user) {
        throw new ApiError(401, "Invalid Access Token", ErrorTypes.INVALID_TOKEN)
    }

    req.user = user;
    next()
});
