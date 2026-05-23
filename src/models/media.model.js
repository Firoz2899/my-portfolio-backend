import { Schema } from "mongoose";

export const MediaSchema = new Schema(
    {
        UniqueCode: {
            type: String,
            required: true,
            trim: true,
            unique: true
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