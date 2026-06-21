import Skill from "#models/skill.model.js";
import {
  ApiError,
  ApiResponse,
  asyncHandler
} from "#utils/index.js";
import {ErrorTypes} from '#constants/constants.js'



export const createSkill = asyncHandler(async (req) => {

  let {
    Title,
    Icon
  } = req.body;

  let SortOrder = 0
const s = await Skill.find({
  Skills: {
    $elemMatch: {
      UniqueCode: { $exists: false }
    }
  }
})

  const maxSkill  = await Skill.findOne({ProfileUniqueCode: req.profileCode})
                        .sort({ SortOrder: -1 }).select("SortOrder");

  SortOrder = maxSkill ? maxSkill.SortOrder + 1 : 1;

  const skill = await Skill.create({
    ProfileUniqueCode: req.profileCode,
    Title,
    Icon,
    SortOrder,
    Skills: []
  });

  await skill.save();

  const response = skill.toObject();

  delete response._id;
  delete response.__v;


  return new ApiResponse(
    201,
    response,
    "Skill created successfully"
  );
});

export const updateSkill = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const skill = await Skill.findOne({
    UniqueCode: uniqueCode,
    ProfileUniqueCode: req.profileCode
  });

  if (!skill) {
    throw new ApiError(
      404,
      "Skill not found or unauthorized to update this skill",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  Object.assign(
    skill,
    req.body
  );

  await skill.save();

  const response = skill.toObject();

  delete response._id;
  delete response.__v;

  return new ApiResponse(
    200,
    response,
    "Skill updated successfully"
  );
});


export const createSubSkill = asyncHandler(async (req) => {

    const { uniqueCode } = req.params;
    console.log("🚀 ~ skill.controller.js:84 ~ uniqueCode:", uniqueCode);

    const {
        Name,
        Percentage
    } = req.body;
        console.log("🚀 ~ skill.controller.js:89 ~ Name:", Name);

    const skillCategory = await Skill.findOne({
        UniqueCode: uniqueCode,
        ProfileUniqueCode: req.profileCode
    });
    console.log("🚀 ~ skill.controller.js:94 ~ skillCategory:", skillCategory);

    if (!skillCategory) {
        throw new ApiError(
            404,
            "Skill category not found",
            ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
        );
    }

    if(!!(skillCategory.Skills.find(x => x.Name.trim().toLowerCase() === Name.trim().toLowerCase()))){
      throw new ApiError(409, "Skill already exists", ErrorTypes.RESOURCE_ALREADY_EXISTS)
    }

    const newSubSkill = {
      Name: Name.trim(),
      Percentage
    };

    skillCategory.Skills.push(newSubSkill);

    await skillCategory.save();

    const createdSubSkill = skillCategory.Skills.at(-1);

    return new ApiResponse(
        201,
        {
          SkillUniqueCode: skillCategory.UniqueCode,
          SubSkill: createdSubSkill
        },
        "Sub skill created successfully"
    );
});

export const deleteSkill = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const deletedSkill = await Skill.findOneAndDelete({
    UniqueCode: uniqueCode,
    ProfileUniqueCode: req.profileCode
  });

  if (!deletedSkill) {
    throw new ApiError(
      404,
      "Skill not found or unauthorized to delete this skill",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  return new ApiResponse(
    200,
    {uniqueCode},
    "Skill deleted successfully"
  );
});

export const getSkillByCode = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const skill = await Skill.findOne({
    UniqueCode: uniqueCode,
    ProfileUniqueCode: req.profileCode
  });

  if (!skill) {
    throw new ApiError(
      404,
      "Skill not found or unauthorized to access this skill",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  return new ApiResponse(
    200,
    skill
  );
});

export const getSkillsByProfile = asyncHandler(async (req) => {

  const skills =
    await Skill.find({
      ProfileUniqueCode: req.profileCode
    })
    .sort({
      SortOrder: 1
    });

  return new ApiResponse(
    200,
    skills
  );
});