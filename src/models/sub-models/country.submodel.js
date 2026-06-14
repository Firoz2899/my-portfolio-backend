import { Schema } from "mongoose";

export const CountrySchema = new Schema(
    {
        Name:{
            type:String,
            trim:true
        },
        Code:{
            type:String,
            trim:true
        },
        
        PhoneCode:{
            type:String,
            trim:true
        },
        Flag:{
            type:String,
            trim:true
        },
        Currency:{
            type:String,
            trim:true
        }
    },
    {
        _id: false  
    }
);