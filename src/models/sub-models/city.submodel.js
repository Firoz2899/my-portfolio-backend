import { Schema } from "mongoose";

export const CitySchema = new Schema(
    {
        Name:{
            type:String,
            trim:true
        },
        CountryCode:{
            type:String,
            trim:true
        },
        StateCode:{
            type:String,
            trim:true
        }
    },
    {
        _id: false  
    }
);