import {Schema, model} from "mongoose";
import { generateUniqueCode } from "../utils/helpers.js";

const ContactSchema = new mongoose.Schema(
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

ContactSchema.pre("save", async function (next) {

  if (!this.UniqueCode) {
    this.UniqueCode = generateUniqueCode("CNT");
  }

  next();
});

export default model(
    "Contact",
    ContactSchema
);