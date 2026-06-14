import { Schema } from "mongoose";
import { generateUniqueCode } from "#utils/helpers.js";
import {UniqueCodePrefixes} from '#constants/constants.js'
import { CountrySchema } from "#subModels/country.submodel.js";
import { StateSchema } from "#subModels/state.submodel.js";
import { CitySchema } from "#subModels/city.submodel.js";

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
            type: CountrySchema,
        },
        State:{
            type: StateSchema,
        },
        City:{
            type: CitySchema,
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