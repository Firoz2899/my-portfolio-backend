import { Schema, model } from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";
import {tableNames, ReservedSlugTypes} from '../constants/constants.js'

const ReservedSlugSchema = new Schema(
{
    UniqueCode: {
        type: String,
        required: true,
        unique: true
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

    if(!this.UniqueCode){
        this.UniqueCode =
            generateUniqueCode("RSL");
    }
    this.Slug = this.Slug.trim().toLowerCase();
    next();
});

export default model(
    tableNames.ReservedSlugs,
    ReservedSlugSchema
);