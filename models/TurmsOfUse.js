

const mongoose = require('mongoose');

// Define the schema for the review model
const termsOfUseSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    privacypolicyDroperDriver:{type:String,required:true},
    otherPolicyDroperDriver:{type:String,required:true},
    isAccepted:{type:Boolean, required:true,default:false}
});

// Create the review model
const TermsOfUse = mongoose.model('TermsOfUse', termsOfUseSchema);

module.exports = TermsOfUse;