
import { ApiError, asyncHandler } from "../utils/index.js";
import {ErrorTypes} from '../constants/constants.js'

export const authenticateRole = (...allowedRoles) => asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ApiError(401, "Unauthorized request", ErrorTypes.UNAUTHORIZED)
        }

        const userRoles = Array.isArray(user.Role) ? user.Role : [];

        const hasAccess = userRoles.some(role =>
            allowedRoles.includes(role)
        );

        if (!hasAccess) {
            throw new ApiError(403, "Access denied", ErrorTypes.ACCESS_DENIED)
        }
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request", ErrorTypes.UNAUTHORIZED)
    }
});