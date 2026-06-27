import {Schema, model} from "mongoose";
import { generateUniqueCode } from "#utils/helpers.js";
import {tableNames, UniqueCodePrefixes, educationLevels} from '#constants/constants.js'
import { AddressSchema } from "#subModels/address.submodel.js";
import { MediaSchema } from "#subModels/media.submodel.js";

const TeamMembersSchema = new Schema({
    UniqueCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        default: () => generateUniqueCode(UniqueCodePrefixes.TeamMember)
    },
    ProfileUniqueCode: {
        type: String,
        required: true
    },
    MemberName: {
        type: String,
        required: true
    },
    Position: {
        type: String,
        required: true
    },
    Image: {
        type: MediaSchema
    },
    Experience: {
        type: Number    // years
    },
    Bio: {
        type: String,
        required: true
    },
    Skills: {
        type: [String]
    },
    Social: {
        Facebook: {
            type: String
        },
        Twitter: {
            type: String
        },
        LinkedIn: {
            type: String
        },
        Instagram: {
            type: String
        },
        Github: {
            type: String
        }
    }
}, {timestamps: true});

export default model(
    tableNames.TeamMember,
    TeamMembersSchema
);