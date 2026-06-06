// middleware/auth.middleware.js

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError, config, asyncHandler } from "../utils/index.js";
import {ErrorTypes} from '../constants/constants.js'

export const authenticateUser = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request", ErrorTypes.UNAUTHORIZED)
        }
    
        const decodedToken = jwt.verify(token, config.accessTokenSecret)
    
        const user = await User.findById(decodedToken?._id).select("-Password -RefreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token", ErrorTypes.INVALID_TOKEN)
        }
    
        req.user = user;
        next()
    } catch (error) {

        if(error.name === 'TokenExpiredError'){
            throw new ApiError(401, "Access Token was Expire", ErrorTypes.TOKEN_EXPIRED)    
        }
        if(error.name === 'JsonWebTokenError'){
            throw new ApiError(401, "Access Token was invalid", ErrorTypes.INVALID_TOKEN)    
        }
        throw new ApiError(401, error?.message || "Something went wrong", ErrorTypes.INVALID_TOKEN)
    }
});
