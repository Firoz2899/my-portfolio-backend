import {Schema, model} from 'mongoose';
const SiteSettingSchema = new Schema({
    DefaultPortfolioUniqueCode: {
        type: String,
        required: true
    }
});

export default model('SiteSetting', SiteSettingSchema);