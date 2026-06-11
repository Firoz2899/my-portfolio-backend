import { ApiResponse, asyncHandler, escapedSlug } from "#utils/index.js";
import ReservedSlug from "#models/reservedSlug.model.js";
import {ErrorTypes} from '#constants/constants.js'

export const validateSlug = asyncHandler(async (req, res, next) => {

    try {
        const { Slug, SlugType } = req.body;
        const reservedSlug = await ReservedSlug.exists({
            Slug: {
                $regex: `^${escapedSlug(Slug.trim())}$`,
                $options: "i"
            },
            SlugType: SlugType.trim().toUpperCase()
        });
        if(reservedSlug){
            return new ApiResponse(
                    200,
                    {
                        Slug: Slug,
                        Exists: true,
                        IsAvailable: false
                    },
                    "This slug is reserved",
                    null,
                    true,
                    ErrorTypes.RESOURCE_ALREADY_EXISTS
                );
        }
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token", ErrorTypes.UNKNOWN_ERROR)
    }
});
