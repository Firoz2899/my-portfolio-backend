import {Schema, model} from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";
import {tableNames, UniqueCodePrefixes} from '../constants/constants.js'

const SkillSchema = new Schema(
    {
        UniqueCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
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

        Category:
        {
            type: String
        },

        Percentage:
        {
            type: Number,
            default: 80
        },

        Icon: String,

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


SkillSchema.pre("save", async function (next) {

  if (!this.UniqueCode) {
    this.UniqueCode = generateUniqueCode(UniqueCodePrefixes.Skill);
  }

  next();
});


export default model(tableNames.Skills, SkillSchema);