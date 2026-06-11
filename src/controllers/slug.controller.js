import ProfileModal from "#models/profile.model.js";
import Project from "#models/project.model.js";
import {ReservedSlugTypes, ErrorTypes} from '#constants/constants.js'
import { ApiResponse, asyncHandler, escapedSlug } from "#utils/index.js";

export const checkSlugAvailability = asyncHandler(async (req) => {

    const { Slug, SlugType } = req.body;
    let slugExists = false;

    if(SlugType.trim().toUpperCase() === ReservedSlugTypes.PROFILE){
        const profile = await ProfileModal.findOne({
            Slug: {
                $regex: `^${escapedSlug(Slug.trim())}$`,
                $options: "i"
            }
        });

        if(profile)
            slugExists = true;
    }

    if(SlugType.trim().toUpperCase() === ReservedSlugTypes.PROJECT){
        const project = await Project.findOne({
            Slug: {
                $regex: `^${escapedSlug(Slug.trim())}$`,
                $options: "i"
            }
        });

        if(project)
            slugExists = true;
    }


    return new ApiResponse(
        200,
        {
            Slug: Slug,
            Exists: slugExists,
            IsAvailable: !slugExists
        },
        slugExists
            ? "Slug already exists"
            : "Slug is available",
        null,
        true,
        slugExists ? ErrorTypes.RESOURCE_ALREADY_EXISTS : null
    );
});

export const createReservedSlug = asyncHandler(async (req) => {

    const {
        Slug,
        SlugType,
        Description
    } = req.body;

    const exists =
        await ReservedSlug.findOne({
            Slug: Slug.trim().toLowerCase()
        });

    if (exists) {
        throw new ApiError(
            400,
            "Slug already exists",
            ErrorTypes.RESOURCE_ALREADY_EXISTS
        );
    }

    const reservedSlug =
        await ReservedSlug.create({
            Slug,
            SlugType,
            Description
        });

    return new ApiResponse(
        201,
        reservedSlug,
        "Reserved slug created successfully"
    );
});

export const updateReservedSlug = asyncHandler(async (req) => {

    const slug =
        await ReservedSlug.findOne({
            UniqueCode:
                req.params.uniqueCode
        });

    if (!slug) {
        throw new ApiError(
            404,
            "Reserved slug not found",
            ErrorTypes.NOT_FOUND
        );
    }

    const {
        Slug,
        SlugType,
        Description
    } = req.body;

    if (Slug) {

        const existing =
            await ReservedSlug.findOne({
                Slug:
                    Slug.trim().toLowerCase(),

                UniqueCode: {
                    $ne:
                        slug.UniqueCode
                }
            });

        if (existing) {
            throw new ApiError(
                400,
                "Slug already exists",
                ErrorTypes.RESOURCE_ALREADY_EXISTS
            );
        }

        slug.Slug = Slug;
    }

    if (SlugType)
        slug.SlugType = SlugType;

    if (Description !== undefined)
        slug.Description = Description;

    await slug.save();

    return new ApiResponse(
        200,
        slug,
        "Reserved slug updated successfully"
    );
});

export const deleteReservedSlug = asyncHandler(async (req) => {

    const slug =
        await ReservedSlug.findOneAndDelete({
            UniqueCode:
                req.params.uniqueCode
        });

    if (!slug) {
        throw new ApiError(
            404,
            "Reserved slug not found",
            ErrorTypes.NOT_FOUND
        );
    }

    return new ApiResponse(
        200,
        null,
        "Reserved slug deleted successfully"
    );
});

export const getReservedSlugs = asyncHandler(async () => {

    const slugs =
        await ReservedSlug.find()
        .sort({
            SlugType: 1,
            Slug: 1
        });

    return new ApiResponse(
        200,
        slugs
    );
});

export const getReservedSlugByCode = asyncHandler(async (req) => {

    const slug =
        await ReservedSlug.findOne({
            UniqueCode:
                req.params.uniqueCode
        });

    if (!slug) {
        throw new ApiError(
            404,
            "Reserved slug not found",
            ErrorTypes.NOT_FOUND
        );
    }

    return new ApiResponse(
        200,
        slug
    );
});