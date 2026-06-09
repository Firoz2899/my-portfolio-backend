import {
    ApiError,
    ApiResponse,
    asyncHandler,
    deleteFromCloudinary,
    uploadToCloudinary,
    escapedSlug,
    generateUniqueCode
} from "../utils/index.js";
import {tableNames, CloudinaryFolders, UniqueCodePrefixes, ErrorTypes} from '../constants/constants.js'
import SiteSettingModel from "../models/siteSetting.model.js";
import ProfileModel from "../models/profile.model.js";

const getProfileCommonAggregatePipeline = (forPublic = false) => [
    {
        $lookup: {
            from: tableNames.Skills,
            localField: "UniqueCode",
            foreignField: "ProfileUniqueCode",
            as: "Skills",
            pipeline: [
                {
                    $sort: {
                        SortOrder: 1
                    }
                }
            ]
        }
    },
    {
        $lookup: {
            from: tableNames.Experiences,
            localField: "UniqueCode",
            foreignField: "ProfileUniqueCode",
            as: "Experiences",
            pipeline: [
                {
                    $sort: {
                        StartDate: -1
                    }
                }
            ]
        }
    },
    {
        $lookup: {
            from: tableNames.Services,
            localField: "UniqueCode",
            foreignField: "ProfileUniqueCode",
            as: "Services",
            pipeline: [
                {
                    $sort: {
                        SortOrder: 1
                    }
                }
            ]
        }
    },
    {
        $lookup: {
            from: tableNames.Projects,
            localField: "UniqueCode",
            foreignField: "ProfileUniqueCode",
            as: "Projects",
            pipeline: [
                ...(forPublic ? [
                    {
                        $match: {
                            IsActive: true
                        }
                    },
                ]: []),
                {
                    $sort: {
                        IsFeatured: -1,
                        createdAt: -1
                    }
                }
            ]
        }
    },
    ...(!forPublic ? {
        $lookup: {
            from: tableNames.Contacts,
            localField: "UniqueCode",
            foreignField: "ProfileUniqueCode",
            as: "Contacts",
            pipeline: [
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ]
        }
    }: {}),
    {
        $project: {
            __v: 0,
            "Projects.__v": 0,
            "Projects._id": 0,

            "Skills.__v": 0,
            "Skills._id": 0,

            "Services.__v": 0,
            "Services._id": 0,

            "Experiences.__v": 0,
            "Experiences._id": 0,

            ...(!forPublic ? {
                "Contacts.__v": 0,
                "Contacts._id": 0
            }: {})
        }
    }
    
]

export const getProfile = asyncHandler(async (req) => {
    const profile = await ProfileModel.aggregate([
        {
            $match: {
                UserUniqueCode: req.user.UniqueCode
            }
        },
        ...getProfileCommonAggregatePipeline(false)
    ]);

    if (!profile.length) {
        throw new ApiError(
            404,
            "Profile not found",
            ErrorTypes.NOT_FOUND
        );
    }

    return new ApiResponse(
        200,
        profile[0],
        "Profile retrieved successfully"
    );
});

export const updateProfile = asyncHandler(async (req) => {

    const profile = await ProfileModel.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!profile) {
        throw new ApiError(404, "Profile not found", ErrorTypes.NOT_FOUND);
    }

    const allowedFields = [
        "FullName",
        "Designation",
        "Summary",
        "AboutMe",
        "Email",
        "Phone",
        "Location",
        "LinkedIn",
        "Github",
        "ResumeUrl"
    ];

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            profile[field] = req.body[field];
        }
    });

    await profile.save();

    return new ApiResponse(
        200,
        profile,
        "Profile updated successfully"
    );
});

export const uploadProfileImage = asyncHandler(async (req) => {

    const profile = await ProfileModel.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!profile) {
        throw new ApiError(
            404,
            "Profile not found",
            ErrorTypes.NOT_FOUND
        );
    }

    if (profile.ProfileImage?.PublicId) {
        await deleteFromCloudinary(
            profile.ProfileImage.PublicId
        );
    }

    const image = await uploadToCloudinary(
        req.file,
        CloudinaryFolders.Profile.ProfilePictures
    );

    image.UniqueCode = generateUniqueCode(UniqueCodePrefixes.Media);

    profile.ProfileImage = image;

    await profile.save();

    return new ApiResponse(
        200,
        image,
        "Profile image uploaded successfully"
    );
});

export const uploadCoverImage = asyncHandler(async (req) => {

    const profile = await ProfileModel.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!profile) {
        throw new ApiError(
            404,
            "Profile not found",
            ErrorTypes.NOT_FOUND
        );
    }

    if (profile.CoverImage?.PublicId) {
        await deleteFromCloudinary(
            profile.CoverImage.PublicId
        );
    }

    const image = await uploadToCloudinary(
        req.file,
        CloudinaryFolders.Profile.CoverPictures
    );

    image.UniqueCode = generateUniqueCode(UniqueCodePrefixes.Media);

    profile.CoverImage = image;

    await profile.save();

    return new ApiResponse(
        200,
        image,
        "Cover image uploaded successfully"
    );
});

export const deleteProfileImage = asyncHandler(async (req) => {

    const profile = await ProfileModel.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!profile) {
        throw new ApiError(
            404,
            "Profile not found",
            ErrorTypes.NOT_FOUND
        );
    }

    if (profile.ProfileImage?.PublicId) {
        await deleteFromCloudinary(
            profile.ProfileImage.PublicId
        );
    }

    profile.ProfileImage = null;

    await profile.save();

    return new ApiResponse(
        200,
        null,
        "Profile image deleted successfully"
    );
});

export const deleteCoverImage = asyncHandler(async (req) => {

    const profile = await ProfileModel.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!profile) {
        throw new ApiError(
            404,
            "Profile not found",
            ErrorTypes.NOT_FOUND
        );
    }

    if (profile.CoverImage?.PublicId) {
        await deleteFromCloudinary(
            profile.CoverImage.PublicId
        );
    }

    profile.CoverImage = null;

    await profile.save();

    return new ApiResponse(
        200,
        null,
        "Cover image deleted successfully"
    );
});

export const getProfileBySlug = asyncHandler(async (req) => {
    const profile = await ProfileModel.aggregate([
        {
            $match: {
                Slug: escapedSlug(req.params.slug),
            }
        },
        ...getProfileCommonAggregatePipeline(true)
    ]);

    if (!profile.length) {
        throw new ApiError(
            404,
            "Profile not found",
            ErrorTypes.NOT_FOUND
        );
    }

    return new ApiResponse(
        200,
        profile[0],
        "Profile retrieved successfully"
    );
});

export const getDefaultProfile = asyncHandler(async (req) => {
    const siteSetting = await SiteSettingModel.findOne();

    if(!siteSetting || !siteSetting?.DefaultProfileUniqueCode){
        return new ApiResponse(
            200,
            null,
            "Default Profile not found. So, display home page now."
        )
    }
    
    const profile = await ProfileModel.aggregate([
        {
            $match: {
                UniqueCode: siteSetting?.Settings?.DefaultProfileUniqueCode,
            }
        },
        ...getProfileCommonAggregatePipeline(true)
    ]);

    if (!profile.length) {
        return new ApiResponse(
            200,
            null,
            "Default Profile not found. So, display home page now."
        )
    }

    return new ApiResponse(
        200,
        profile[0],
        "Profile retrieved successfully"
    );
});

export const updateProfileSlug = asyncHandler(async (req) => {

    const profile = await ProfileModel.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!profile) {
        throw new ApiError(404, "Profile not found", ErrorTypes.NOT_FOUND);
    }

    profile.Slug = req.params.slug.trim();

    await profile.save();

    return new ApiResponse(
        200,
        profile,
        "profile slug updated successfully"
    );
});