
import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { config, generateUniqueCode, generateOTP } from "../utils/index.js";
import {tableNames, Roles, UniqueCodePrefixes} from '../constants/constants.js'

const UserSchema = new Schema(
{
  FirstName: {
    type: String,
    required: true,
    trim: true,
  },
  LastName: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
  },
  Password: {
    type: String,
    required: true
  },
  RefreshToken: String,
  UniqueCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  Role: {
    type: String,
    enum: Object.values(Roles),
    default: Roles.USER
  },
  IsActive: {
    type: Boolean,
    default: true
  },
  IsEmailVerified: {
    type: Boolean,
    default: false
  },

  EmailOTP: String,

  EmailOTPExpiry: Date
},
{
    timestamps: true
});

UserSchema.pre("save", async function (next) {

  if (!this.UniqueCode) {
    this.UniqueCode = generateUniqueCode(UniqueCodePrefixes.User);
  }

  if (this.isModified("Password")) {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
  }

  if (this.isModified("Email")) {
    this.IsEmailVerified = false;
    this.EmailOTP = generateOTP();
    this.EmailOTPExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );
  }

  next();
});

UserSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password, this.Password);
};

UserSchema.methods.isOtpCorrect = function (otp){
  if (!this.EmailOTPExpiry) {
    return false;
  }

  if(this.EmailOTPExpiry < new Date()){
    throw false;
  }
  
  return this.EmailOTP === otp;
};

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      UniqueCode: this.UniqueCode,
      Email: this.Email,
      FirstName: this.FirstName,
      LastName: this.LastName,
      DisplayName: this.DisplayName
    },
    config.accessTokenSecret,
    { 
        expiresIn: config.accessTokenExpiresIn, 
        issuer: config.issuer
    }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      UniqueCode: this.UniqueCode,
    },
    config.refreshTokenSecret,
    { 
        expiresIn: config.refreshTokenExpiresIn, 
        issuer: config.issuer
    }
  );
};

// UserSchema.methods.generateForgotPasswordToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//     },
//     config.forgetPasswordTokenSecret,
//     { 
//         expiresIn: config.forgetPasswordTokenExpiresIn, 
//         issuer: config.issuer
//     }
//   );
// };

// UserSchema.methods.generateEmailVerificationToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//     },
//     config.emailVerificationTokenSecret,
//     { 
//         expiresIn: config.emailVerificationTokenExpiresIn, 
//         issuer: config.issuer
//     }
//   );
// };

export default model(
    tableNames.User,
    UserSchema
);