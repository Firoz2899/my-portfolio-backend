
import { ApiError, asyncHandler } from "../utils/index.js";
import {ErrorTypes} from '../constants/constants.js'

export const authenticateRole = (...roles) => asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ApiError(401, "Unauthorized request", ErrorTypes.UNAUTHORIZED)
        }

        if (!roles.includes(req.user.Role)) {
            throw new ApiError(403, "Access denied", ErrorTypes.ACCESS_DENIED)
        }
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request", ErrorTypes.UNAUTHORIZED)
    }
});