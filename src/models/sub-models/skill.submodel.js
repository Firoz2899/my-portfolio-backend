import {Schema, model} from "mongoose";
import { generateUniqueCode } from "#utils/helpers.js";
import {tableNames, UniqueCodePrefixes} from '#constants/constants.js'

export const SubSkillSchema = new Schema(
    {
         UniqueCode: {
            type: String,
            // required: true,
            trim: true,
            default: () => generateUniqueCode(UniqueCodePrefixes.SubSkill)
        },
        Name:
        {
            type: String,
            required: true
        },
        Percentage:
        {
            type: Number,
            default: 80
        },
    },
    {
        _id: false
    }
)