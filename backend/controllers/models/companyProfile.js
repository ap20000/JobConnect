import mongoose from "mongoose";
const companyProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: {type: String, required:true},
    companyDescription: {type: String, required:true},
    companyLocation: {type: String, required:true},
    companyLogo: {type: String, required:true},
    companyWebsite: {type: String, required:true},
    companyPhoneNumber:{type: String},
 postedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }]

});
module.exports = mongoose.model('CompanyProfile', companyProfileSchema);