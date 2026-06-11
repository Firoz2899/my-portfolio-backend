import { Schema } from "mongoose";
import { generateUniqueCode } from "#utils/helpers.js";
import {UniqueCodePrefixes} from '#constants/constants.js'

export const MediaSchema = new Schema(
    {
        UniqueCode: {
            type: String,
            required: true,
            trim: true,
            default: () => generateUniqueCode(UniqueCodePrefixes.MediaSchema)
        },
        OriginalUrl: {
            type: String,
            required: true
        },

        ThumbnailUrl: {
            type: String,
            required: true
        },

        PublicId: {
            type: String,
            required: true
        },

        Alt: String,

        Caption: String,

        Width: Number,

        Height: Number,

        Size: Number,

        SortOrder: {
            type: Number,
            default: 0
        }
    },
    {
        _id: false  
    }
);