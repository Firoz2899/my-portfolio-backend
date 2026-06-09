import {Schema, model} from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";
import {tableNames, UniqueCodePrefixes} from '../constants/constants.js'

const ExperienceSchema = new Schema(
    {
        UniqueCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            default: () => generateUniqueCode(UniqueCodePrefixes.Experience)
        },
        ProfileUniqueCode: {
            type: String,
            required: true
        },

        Company: String,

        Designation: String,

        StartDate: Date,

        EndDate: Date,

        Description: String
    }, {
        timestamps: true
    }
);

export default model(
    tableNames.Experiences,
    ExperienceSchema
);