import {Schema, model} from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";
import {MediaSchema} from "./media.model.js";
import {tableNames, UniqueCodePrefixes} from '../constants/constants.js'

const PortfolioSchema = new Schema(
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
    FullName: String,

    Designation: String,

    Summary: String,

    AboutMe: String,

    ProfileImage: MediaSchema,

    CoverImage: MediaSchema,

    ResumeUrl: String,

    Email: String,

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


PortfolioSchema.pre("save", async function (next) {

  if (!this.UniqueCode) {
    this.UniqueCode = generateUniqueCode(UniqueCodePrefixes.Portfolio);
  }

  next();
});


export default model(
    tableNames.Portfolios,
    PortfolioSchema
);