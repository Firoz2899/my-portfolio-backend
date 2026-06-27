import {Schema, model} from "mongoose";
import { generateUniqueCode } from "#utils/helpers.js";
import {tableNames, UniqueCodePrefixes, educationLevels} from '#constants/constants.js'
import { AddressSchema } from "#subModels/address.submodel.js";


const EducationSchema = new Schema(
    {
        UniqueCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            default: () => generateUniqueCode(UniqueCodePrefixes.Education)
        },
        ProfileUniqueCode: {
            type: String,
            required: true
        },
        EducationLevel: {
            type: String,
            enum: educationLevels,
            required: [true, "Education Level is required"],
        },
        Institute: {
            type: String,
            required: [true, "Institution name is required"]
        },
        Degree: {
            type: String
        },
        SpecializationOfStudy: {
            type: String
        },
        Description: {
            type: String
        },
        StartDate: {
            type: Date,
            required: [true, "Start date is required"]
        },
        EndDate: {
            type: Date
        },
        Marks : {
            type: Number,
            min: 0
        },
        Grade: {
            type: Number,
            min: 0,
            max: 4.0 
        },
        Address: {
            type: AddressSchema
        },
        Achievements: {
            type: [String], 
            trim: true
        }
    },
    { timestamps: true }
)

export default model(
    tableNames.Education,
    EducationSchema
);