import {Schema, model} from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";

const ServiceSchema =
new Schema(
{
    UniqueCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    PortfolioUniqueCode: {
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
    }
});

ServiceSchema.pre("save", async function (next) {

  if (!this.UniqueCode) {
    this.UniqueCode = generateUniqueCode("SRV");
  }

  next();
});

export default model(
    "Service",
    ServiceSchema
);