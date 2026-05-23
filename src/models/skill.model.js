import {Schema, model} from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";

const SkillSchema = new Schema(
    {
        UniqueCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        PortfolioUniqueCode: {
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
    this.UniqueCode = generateUniqueCode("SKL");
  }

  next();
});


export default model("Skill", SkillSchema);