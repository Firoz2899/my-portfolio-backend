import {Schema, model} from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";
import {tableNames, UniqueCodePrefixes} from '../constants/constants.js'

const ExperienceSchema = new Schema(
    {
        UniqueCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
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

ExperienceSchema.pre("save", async function (next) {

  if (!this.UniqueCode) {
    this.UniqueCode = generateUniqueCode(UniqueCodePrefixes.Experience);
  }

  next();
});

export default model(
    tableNames.Experiences,
    ExperienceSchema
);