import TeamMember from "#models/teamMember.model.js";

import {
    ApiError,
    ApiResponse,
    asyncHandler,
    uploadToCloudinary,
    deleteFromCloudinary,
    generateUniqueCode
} from "#utils/index.js";

import {
    CloudinaryFolders,
    ErrorTypes,
    UniqueCodePrefixes
} from "#constants/constants.js";

export const createTeamMember = asyncHandler(async (req) => {

    const teamMember = new TeamMember({
        ProfileUniqueCode: req.profileCode,
        ...req.body
    });

    if (req.file) {

        const image = await uploadToCloudinary(
            req.file,
            CloudinaryFolders.TeamMember.Image
        );

        image.UniqueCode = generateUniqueCode(
            UniqueCodePrefixes.Media
        );

        teamMember.Image = image;
    }

    await teamMember.save();

    return new ApiResponse(
        201,
        teamMember,
        "Team member created successfully"
    );
});

export const updateTeamMember = asyncHandler(async (req) => {

    const { uniqueCode } = req.params;

    const teamMember = await TeamMember.findOne({
        UniqueCode: uniqueCode,
        ProfileUniqueCode: req.profileCode
    });

    if (!teamMember) {
        throw new ApiError(
            404,
            "Team member not found or unauthorized to update this team member",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
        );
    }

    Object.assign(
        teamMember,
        req.body
    );

    if (req.file) {

        if (teamMember.Image?.PublicId) {
            await deleteFromCloudinary(
                teamMember.Image.PublicId
            );
        }

        const image = await uploadToCloudinary(
            req.file,
            CloudinaryFolders.TeamMember.Image
        );

        image.UniqueCode = generateUniqueCode(
            UniqueCodePrefixes.Media
        );

        teamMember.Image = image;
    }

    await teamMember.save();

    return new ApiResponse(
        200,
        teamMember,
        "Team member updated successfully"
    );
});

export const deleteTeamMember = asyncHandler(async (req) => {

    const { uniqueCode } = req.params;

    const teamMember = await TeamMember.findOne({
        UniqueCode: uniqueCode,
        ProfileUniqueCode: req.profileCode
    });

    if (!teamMember) {
        throw new ApiError(
            404,
            "Team member not found or unauthorized to delete this team member",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
        );
    }

    if (teamMember.Image?.PublicId) {
        await deleteFromCloudinary(
            teamMember.Image.PublicId
        );
    }

    await teamMember.deleteOne();

    return new ApiResponse(
        200,
        {
            TeamMemberUniqueCode: uniqueCode
        },
        "Team member deleted successfully"
    );
});

export const getTeamMemberByCode = asyncHandler(async (req) => {

    const { uniqueCode } = req.params;

    const teamMember = await TeamMember.findOne({
        UniqueCode: uniqueCode,
        ProfileUniqueCode: req.profileCode
    });

    if (!teamMember) {
        throw new ApiError(
            404,
            "Team member not found or unauthorized to view this team member",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
        );
    }

    return new ApiResponse(
        200,
        teamMember
    );
});

export const getAllTeamMembers = asyncHandler(async (req) => {

    const teamMembers = await TeamMember.find({
        ProfileUniqueCode: req.profileCode
    }).sort({
        createdAt: -1
    });

    return new ApiResponse(
        200,
        teamMembers
    );
});