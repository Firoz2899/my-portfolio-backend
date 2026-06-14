import { Schema } from "mongoose";

export const StateSchema = new Schema(
    {
        Name:{
            type:String,
            trim:true
        },
        Code:{
            type:String,
            trim:true
        },
        CountryCode:{
            type:String,
            trim:true
        }
    },
    {
        _id: false  
    }
);