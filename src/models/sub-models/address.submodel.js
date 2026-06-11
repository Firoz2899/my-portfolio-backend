import { Schema } from "mongoose";
import { generateUniqueCode } from "#utils/helpers.js";
import {UniqueCodePrefixes} from '#constants/constants.js'

export const AddressSchema = new Schema(
    {
        UniqueCode: {
            type: String,
            required: true,
            trim: true,
            default: () => generateUniqueCode(UniqueCodePrefixes.Address)
        },
        AddressLine1:{
            type:String,
            trim:true
        },
        AddressLine2:{
            type:String,
            trim:true
        },
        Country:{
            type:String,
            trim:true
        },
        State:{
            type:String,
            trim:true
        },
        City:{
            type:String,
            trim:true
        },
        Pincode:{
            type:String,
            trim:true
        }
    },
    {
        _id: false  
    }
);