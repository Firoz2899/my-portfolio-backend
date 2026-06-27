import Education from "#models/education.model.js";
import { ErrorTypes } from "#constants/constants.js";

import {
  ApiError,
  ApiResponse,
  asyncHandler
} from "#utils/index.js";

export const createEducation = asyncHandler(async (req) => {

  const {
    EducationLevel,
    Institute,
    Degree,
    SpecializationOfStudy,
    Description,
    StartDate,
    EndDate,
    Marks,
    Grade,
    Address,
    Achievements
  } = req.body;

  const education = await Education.create({
    ProfileUniqueCode: req.profileCode,
    EducationLevel,
    Institute,
    Degree,
    SpecializationOfStudy,
    Description,
    StartDate,
    EndDate,
    Marks,
    Grade,
    Address,
    Achievements
  });

  return new ApiResponse(
    201,
    education,
    "Education created successfully"
  );
});

export const updateEducation = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const education = await Education.findOne({
    UniqueCode: uniqueCode,
    ProfileUniqueCode: req.profileCode
  });

  if (!education) {
    throw new ApiError(
      404,
      "Education not found or unauthorized to update this education",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  Object.assign(
    education,
    req.body
  );

  await education.save();

  return new ApiResponse(
    200,
    education,
    "Education updated successfully"
  );
});

export const deleteEducation = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const education = await Education.findOneAndDelete({
    UniqueCode: uniqueCode,
    ProfileUniqueCode: req.profileCode
  });

  if (!education) {
    throw new ApiError(
      404,
      "Education not found or unauthorized to delete this education",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  return new ApiResponse(
    200,
    {
      EducationUniqueCode: uniqueCode
    },
    "Education deleted successfully"
  );
});

export const getEducationByCode = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const education = await Education.findOne({
    UniqueCode: uniqueCode,
    ProfileUniqueCode: req.profileCode
  });

  if (!education) {
    throw new ApiError(
      404,
      "Education not found or unauthorized to view this education",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  return new ApiResponse(
    200,
    education
  );
});

export const getAllEducations = asyncHandler(async (req) => {

  const educations = await Education.find({
    ProfileUniqueCode: req.profileCode
  }).sort({
    StartDate: -1
  });

  return new ApiResponse(
    200,
    educations
  );
});