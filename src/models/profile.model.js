import {Schema, model} from "mongoose";
import { generateUniqueCode } from "#utils/helpers.js";
import {MediaSchema} from "#subModels/media.submodel.js";
import {AddressSchema} from "#subModels/address.submodel.js";
import {tableNames, UniqueCodePrefixes} from '#constants/constants.js'

const ProfileSchema = new Schema(
{
    UniqueCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        default: () => generateUniqueCode(UniqueCodePrefixes.Profile)
    },
    UserUniqueCode: {
        type: String,
        required: true
    },
    FullName: {
        type: String,
        trim: true,
        required: true
    },
    Email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
    },
    Phone: String,
    Designation: String,
    Hobbies: {
      type: [String],
      trim: true,
    },
    Language: {
      type: [String],
      trim: true,
    },
    Availability: {
      type: String,
      trim: true,
    },
    Summary: String,
    AboutMe: String,
    ProfileImage: {
        type: MediaSchema
    },
    CoverImage: {
        type: MediaSchema
    },
    Address: {
        type: AddressSchema
    },
    Slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
},
{
    timestamps: true
});

export default model(
    tableNames.Profiles,
    ProfileSchema
);