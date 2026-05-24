import {Schema, model} from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";
import {MediaSchema} from "./media.model.js";
import {tableNames} from '../constants/constants.js'

const ProjectSchema = new Schema(
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

        Slug:
        {
            type: String,
            unique: true
        },

        ShortDescription: String,

        Description: String,

        WebsiteUrl: String,

        GithubUrl: String,

        CoverImage: MediaSchema,

        ProjectImages: [MediaSchema],

        Technologies: [String],

        Features: [String],

        StartDate: Date,

        EndDate: Date,

        IsFeatured:
        {
            type: Boolean,
            default: false
        },

        IsActive:
        {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

ProjectSchema.pre("save", async function (next) {

  if (!this.UniqueCode) {
    this.UniqueCode = generateUniqueCode("PRJ");
  }

  next();
});

export default model(
    tableNames.Projects,
    ProjectSchema
);