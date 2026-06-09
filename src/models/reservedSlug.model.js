import { Schema, model } from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";
import {tableNames, ReservedSlugTypes, UniqueCodePrefixes} from '../constants/constants.js'

const ReservedSlugSchema = new Schema(
{
    UniqueCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        default: () => generateUniqueCode(UniqueCodePrefixes.ReservedSlug)
    },

    Slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    SlugType: {
        type: String,
        required: true,
        enum: Object.values(ReservedSlugTypes)
    },

    Description: String
},
{
    timestamps: true
});

ReservedSlugSchema.pre("save", function(next){
    this.Slug = this.Slug.trim().toLowerCase();
});

export default model(
    tableNames.ReservedSlugs,
    ReservedSlugSchema
);