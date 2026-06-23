import Experience from "#models/experience.model.js";
import {ErrorTypes} from '#constants/constants.js'

import {
  ApiError,
  ApiResponse,
  asyncHandler
} from "#utils/index.js";

export const createExperience = asyncHandler(async (req) => {

  const {
    Company,
    Position,
    Address,
    Phone,
    Website,
    Description,
    StartDate,
    EndDate,
    Description,
    Achievements
  } = req.body;

  const experience =
    await Experience.create({
      ProfileUniqueCode: req.profileCode,
      Company,
      Position,
      Address,
      Phone,
      Website,
      Description,
      StartDate,
      EndDate,
      Description,
      Achievements
    });

  return new ApiResponse(
    201,
    experience,
    "Experience created successfully"
  );
});

export const updateExperience = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const experience =
    await Experience.findOne({
      UniqueCode: uniqueCode,
      ProfileUniqueCode: req.profileCode
    });

  if (!experience) {
    throw new ApiError(
      404,
      "Experience not found or unauthorized to update this experience",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  Object.assign(
    experience,
    req.body
  );

  await experience.save();

  return new ApiResponse(
    200,
    experience,
    "Experience updated successfully"
  );
});

export const deleteExperience = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const experience = await Experience.findOneAndDelete({
    UniqueCode: uniqueCode,
    ProfileUniqueCode: req.profileCode
  });

  if(!experience){
    throw new ApiError(
      404,
      "Experience not found or unauthorized to delete this experience",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  return new ApiResponse(
    200,
    null,
    "Experience deleted successfully"
  );
});

export const getExperienceByCode = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const experience =
    await Experience.findOne({
      UniqueCode: uniqueCode,
      ProfileUniqueCode: req.profileCode
    });

  if (!experience) {
    throw new ApiError(
      404,
      "Experience not found or unauthorized to view this experience",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  return new ApiResponse(
    200,
    experience
  );
});

export const getAllExperiences = asyncHandler(async (req) => {

  const experiences = await Experience.find({ProfileUniqueCode: req.profileCode})
    .sort({
      StartDate: -1
    });
  return new ApiResponse(
    200,
    experiences
  );
});