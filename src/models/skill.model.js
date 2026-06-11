import {Schema, model} from "mongoose";
import { generateUniqueCode } from "#utils/helpers.js";
import {tableNames, UniqueCodePrefixes} from '#constants/constants.js'
import {SubSkillSchema} from '#subModels/skill.submodel.js'

const SkillSchema = new Schema(
    {
        UniqueCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            default: () => generateUniqueCode(UniqueCodePrefixes.Skill)
        },
        ProfileUniqueCode: {
            type: String,
            required: true
        },
        Title:
        {
            type: String,
            required: true
        },
        Icon: String,
        Skills: {
            type: [SubSkillSchema]
        },
        SortOrder:
        {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export default model(tableNames.Skills, SkillSchema);