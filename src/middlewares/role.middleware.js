
import { ApiError, asyncHandler } from "../utils/index.js";

export const authenticateRole = (...roles) => asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            throw new ApiError(401, "Unauthorized request")
        }

        if (!roles.includes(req.user.Role)) {
            throw new ApiError(403, "Access denied")
        }
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request")
    }
});