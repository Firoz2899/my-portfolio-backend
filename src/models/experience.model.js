import {Schema, model} from "mongoose";
import { generateUniqueCode } from "#utils/helpers.js";
import {tableNames, UniqueCodePrefixes} from '#constants/constants.js'
import { AddressSchema } from "#subModels/address.submodel.js";

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
        Company: {
             type: String, 
             trim: true, 
             required: true 
        },
        Position: {
             type: String, 
             trim: true, 
             required: true 
        },
        Address: {
            type: AddressSchema
        },
        Phone: {
            type: String, 
            trim: true
        },
        Website: {
            type: String, 
            trim: true
        },
        StartDate: {
            type: Date,
            required: true
        },
        EndDate: {
            type: Date
        },
        Description: {
            type: String, 
            trim: true
        },
        Achievements: {
            type: [String], 
            trim: true
        }
    }, {
        timestamps: true
    }
);

export default model(
    tableNames.Experiences,
    ExperienceSchema
);