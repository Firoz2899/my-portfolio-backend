import {Schema, model} from 'mongoose';
import {tableNames} from '#constants/constants.js'

const SiteSettingSchema = new Schema({
    DefaultProfileUniqueCode: {
        type: String,
        required: true
    }
});

export default model(tableNames.SiteSettings, SiteSettingSchema);