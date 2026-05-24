import { ApiResponse, asyncHandler, escapedSlug } from "../utils/index.js";
import ReservedSlug from "../models/reservedSlug.model.js";

export const validateSlug = asyncHandler(async (req, res, next) => {

    try {
        const { slug, slugType } = req.body;
        const reservedSlug = await ReservedSlug.exists({
            Slug: {
                $regex: `^${escapedSlug(slug.trim())}$`,
                $options: "i"
            },
            SlugType: slugType.trim().toUpperCase()
        });
        if(reservedSlug){
            throw new ApiError(400, "This slug is reserved");
        }
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
});
