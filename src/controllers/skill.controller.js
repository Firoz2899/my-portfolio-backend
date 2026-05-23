import Skill from "../models/skill.model.js";
import Portfolio from "../models/portfolio.model.js";
import {
  ApiError,
  ApiResponse,
  asyncHandler
} from "../utils/index.js";



export const createSkill = asyncHandler(async (req) => {

  const {
    Title,
    Category,
    Percentage,
    Icon,
    SortOrder
  } = req.body;

  if (!Title) {
    throw new ApiError(
      400,
      "Title is required"
    );
  }

  const skill = await Skill.create({
    PortfolioUniqueCode: req.portfolioCode,
    Title,
    Category,
    Percentage,
    Icon,
    SortOrder
  });

  await skill.save();

  return new ApiResponse(
    201,
    skill,
    "Skill created successfully"
  );
});

export const updateSkill = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const skill = await Skill.findOne({
    UniqueCode: uniqueCode,
    PortfolioUniqueCode: req.portfolioCode
  });

  if (!skill) {
    throw new ApiError(
      404,
      "Skill not found or unauthorized to update this skill"
    );
  }

  Object.assign(
    skill,
    req.body
  );

  return new ApiResponse(
    200,
    skill,
    "Skill updated successfully"
  );
});

export const deleteSkill = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const deletedSkill = await Skill.findOneAndDelete({
    UniqueCode: uniqueCode,
    PortfolioUniqueCode: req.portfolioCode
  });

  if (!deletedSkill) {
    throw new ApiError(
      404,
      "Skill not found or unauthorized to delete this skill"
    );
  }

  return new ApiResponse(
    200,
    null,
    "Skill deleted successfully"
  );
});

export const getSkillByCode = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const skill = await Skill.findOne({
    UniqueCode: uniqueCode,
    PortfolioUniqueCode: req.portfolioCode
  });

  if (!skill) {
    throw new ApiError(
      404,
      "Skill not found or unauthorized to access this skill"
    );
  }

  return new ApiResponse(
    200,
    skill
  );
});

export const getSkillsByPortfolio = asyncHandler(async (req) => {

  const skills =
    await Skill.find({
      PortfolioUniqueCode: req.portfolioCode
    })
    .sort({
      SortOrder: 1
    });

  return new ApiResponse(
    200,
    skills
  );
});