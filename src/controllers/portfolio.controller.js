import Portfolio from "../models/portfolio.model.js";
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    deleteFromCloudinary,
    uploadToCloudinary,
    escapedSlug
} from "../utils/index.js";
import {tableNames, CloudinaryFolders} from '../constants/constants.js'
import SiteSettingModel from "../models/siteSetting.model.js";

const getPortfolioCommonAggregatePipeline = (forPublic = false) => [
    {
        $lookup: {
            from: tableNames.Skills,
            localField: "UniqueCode",
            foreignField: "PortfolioUniqueCode",
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
            foreignField: "PortfolioUniqueCode",
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
            foreignField: "PortfolioUniqueCode",
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
            foreignField: "PortfolioUniqueCode",
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
            foreignField: "PortfolioUniqueCode",
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

export const getPortfolio = asyncHandler(async (req) => {
    const portfolio = await Portfolio.aggregate([
        {
            $match: {
                UserUniqueCode: req.user.UniqueCode
            }
        },
        ...getPortfolioCommonAggregatePipeline(false)
    ]);

    if (!portfolio.length) {
        throw new ApiError(
            404,
            "Portfolio not found"
        );
    }

    return new ApiResponse(
        200,
        portfolio[0],
        "Portfolio retrieved successfully"
    );
});

export const updatePortfolio = asyncHandler(async (req) => {

    const portfolio = await Portfolio.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!portfolio) {
        throw new ApiError(404, "Portfolio not found");
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
            portfolio[field] = req.body[field];
        }
    });

    await portfolio.save();

    return new ApiResponse(
        200,
        portfolio,
        "Portfolio updated successfully"
    );
});

export const uploadProfileImage = asyncHandler(async (req) => {

    const portfolio = await Portfolio.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!portfolio) {
        throw new ApiError(
            404,
            "Portfolio not found"
        );
    }

    if (portfolio.ProfileImage?.PublicId) {
        await deleteFromCloudinary(
            portfolio.ProfileImage.PublicId
        );
    }

    const image = await uploadToCloudinary(
        req.file,
        CloudinaryFolders.Portfolio.ProfilePictures
    );

    portfolio.ProfileImage = image;

    await portfolio.save();

    return new ApiResponse(
        200,
        image,
        "Profile image uploaded successfully"
    );
});

export const uploadCoverImage = asyncHandler(async (req) => {

    const portfolio = await Portfolio.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!portfolio) {
        throw new ApiError(
            404,
            "Portfolio not found"
        );
    }

    if (portfolio.CoverImage?.PublicId) {
        await deleteFromCloudinary(
            portfolio.CoverImage.PublicId
        );
    }

    const image = await uploadToCloudinary(
        req.file,
        CloudinaryFolders.Portfolio.CoverPictures
    );

    portfolio.CoverImage = image;

    await portfolio.save();

    return new ApiResponse(
        200,
        image,
        "Cover image uploaded successfully"
    );
});

export const deleteProfileImage = asyncHandler(async (req) => {

    const portfolio = await Portfolio.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!portfolio) {
        throw new ApiError(
            404,
            "Portfolio not found"
        );
    }

    if (portfolio.ProfileImage?.PublicId) {
        await deleteFromCloudinary(
            portfolio.ProfileImage.PublicId
        );
    }

    portfolio.ProfileImage = null;

    await portfolio.save();

    return new ApiResponse(
        200,
        null,
        "Profile image deleted successfully"
    );
});

export const deleteCoverImage = asyncHandler(async (req) => {

    const portfolio = await Portfolio.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!portfolio) {
        throw new ApiError(
            404,
            "Portfolio not found"
        );
    }

    if (portfolio.CoverImage?.PublicId) {
        await deleteFromCloudinary(
            portfolio.CoverImage.PublicId
        );
    }

    portfolio.CoverImage = null;

    await portfolio.save();

    return new ApiResponse(
        200,
        null,
        "Cover image deleted successfully"
    );
});

export const getPortfolioBySlug = asyncHandler(async (req) => {
    const portfolio = await Portfolio.aggregate([
        {
            $match: {
                Slug: escapedSlug(req.params.slug),
            }
        },
        ...getPortfolioCommonAggregatePipeline(true)
    ]);

    if (!portfolio.length) {
        throw new ApiError(
            404,
            "Portfolio not found"
        );
    }

    return new ApiResponse(
        200,
        portfolio[0],
        "Portfolio retrieved successfully"
    );
});

export const getDefaultPortfolio = asyncHandler(async (req) => {
    const siteSetting = await SiteSettingModel.findOne();

    if (!siteSetting?.Settings?.DefaultPortfolioUniqueCode) {
        throw new ApiError(
            404,
            "Default portfolio not configured"
        );
    }

    const portfolio = await Portfolio.aggregate([
        {
            $match: {
                UniqueCode: siteSetting?.Settings?.DefaultPortfolioUniqueCode,
            }
        },
        ...getPortfolioCommonAggregatePipeline(true)
    ]);

    if (!portfolio.length) {
        throw new ApiError(
            404,
            "Portfolio not found"
        );
    }

    return new ApiResponse(
        200,
        portfolio[0],
        "Portfolio retrieved successfully"
    );
});

export const updatePortfolioSlug = asyncHandler(async (req) => {

    const portfolio = await Portfolio.findOne({
        UserUniqueCode: req.user.UniqueCode
    });

    if (!portfolio) {
        throw new ApiError(404, "Portfolio not found");
    }

    portfolio.Slug = req.params.slug.trim();

    await portfolio.save();

    return new ApiResponse(
        200,
        portfolio,
        "Portfolio slug updated successfully"
    );
});