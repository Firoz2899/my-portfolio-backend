import {Schema} from "mongoose";
import { generateUniqueCode } from "#utils/helpers.js";
import {LanguageLevel, UniqueCodePrefixes} from '#constants/constants.js'

export const LanguageSchema = new Schema({
    UniqueCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        default: () => generateUniqueCode(UniqueCodePrefixes.Language)
    },
    Name: {
        type: String,
        trim: true,
        required: true
    },
    Level: {
        type: String,
        enum: Object.values(LanguageLevel),
        required: true
    }
}, { _id: false })