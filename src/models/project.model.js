import {Schema, model} from "mongoose";
import { generateUniqueCode } from "#utils/helpers.js";
import {MediaSchema} from "#subModels/media.submodel.js";
import {tableNames, UniqueCodePrefixes} from '#constants/constants.js'

const ProjectSchema = new Schema(
    {
        UniqueCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            default: () => generateUniqueCode(UniqueCodePrefixes.Project)
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

        Slug:
        {
            type: String,
            unique: true
        },

        ShortDescription: String,

        Description: String,

        WebsiteUrl: String,

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

export default model(
    tableNames.Projects,
    ProjectSchema
);