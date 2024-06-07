

const mongoose = require('mongoose');

// Define the schema for the review model
const privecyPolicySchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    privacypolicyDroperDriver:{type:mongoose.Schema.Types.ObjectId,ref:"TermsOfUse",required:true},
    isAcceptedPrivecyPolicy:{type:Boolean, required:true,default:false},
    isAcceptedTermsAndUse:{type:Boolean, required:true,default:false}
});

// Create the review model
const PrivecyPolicy = mongoose.model('PrivecyPolicy', privecyPolicySchema);

module.exports = PrivecyPolicy;