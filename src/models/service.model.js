import {Schema, model} from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";
import {tableNames, UniqueCodePrefixes} from '../constants/constants.js'

const ServiceSchema =
new Schema(
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
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Icon: {
        type: String,
        required: true
    },
    SortOrder: {
        type: Number,
        default: 0
    }
});

ServiceSchema.pre("save", async function (next) {

  if (!this.UniqueCode) {
    this.UniqueCode = generateUniqueCode(UniqueCodePrefixes.Service);
  }

  next();
});

export default model(
    tableNames.Services,
    ServiceSchema
);