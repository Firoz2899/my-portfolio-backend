import {Schema, model} from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";
import {tableNames, UniqueCodePrefixes} from '../constants/constants.js'

const ContactSchema = new mongoose.Schema(
    {
        UniqueCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            default: () => generateUniqueCode(UniqueCodePrefixes.Contact)
        },
        ProfileUniqueCode: {
            type: String,
            required: true
        },
        FullName: String,

        Email: String,

        Subject: String,

        Message: String,

        IsRead:
        {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default model(
    tableNames.Contacts,
    ContactSchema
);