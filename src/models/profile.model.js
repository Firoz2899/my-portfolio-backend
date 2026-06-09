import {Schema, model} from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";
import {MediaSchema} from "./media.model.js";
import {tableNames, UniqueCodePrefixes} from '../constants/constants.js'

const ProfileSchema = new Schema(
{
    UniqueCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
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

    Designation: String,

    Summary: String,

    AboutMe: String,

    ProfileImage: MediaSchema,

    CoverImage: MediaSchema,

    ResumeUrl: String,

    Email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
    },

    Phone: String,

    Location: String,

    LinkedIn: String,

    Github: String,

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


ProfileSchema.pre("save", async function (next) {

  if (!this.UniqueCode) {
    this.UniqueCode = generateUniqueCode(UniqueCodePrefixes.Profile);
  }

  next();
});


export default model(
    tableNames.Profiles,
    ProfileSchema
);