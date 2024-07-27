const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [ true, "Name is required"], minlength: 3, maxlength: 30, },
    email: {
        type: String, required: [true, "Email is required"], minlength: 3, maxlength: 30, trim: true,
        unique: [true, 'Email should be unique'],
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
            },
            message: 'Please enter a valid Email'
        }
    },
    password: {
        type: String, required: [false, "Password is required"], minlength: 3,
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    dateOfBirth: { type: String, required: false},
    // currentLocation:{type:mongoose.Schema.Types.ObjectId,ref:"Location", required:false},
    currentLocation:{type:Object,required:false},
    phone: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    rate:{type:String,required:false},
    rating:{type:String,required:false,default:"0"},
    description:{type:String,required:false},
    state: { type: String, required: false},
    status:{type:String,required:false,default:"inactive"},
    privacyPolicyAccepted: { type: Boolean, default: false, required: false },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    // assignedDrivertrack:{type:String,enum:["waytoPickup","arrivedtheStore","orderPicked","waytodeliver","arrivedAtLocation","orderDelivered"],default:null},
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isLoggedIn:{type:Boolean,default:false},
    // boutiqueImage: { type: Object, required: false, default: { publicFileURL: "images/users/user.png", path: "public\\images\\users\\user.png" } },
    image: { type: Object, required: false, default: { publicFileURL: "images/users/user.png", path: "public\\images\\users\\user.png" } },
    role: { type: String, required: false, enum: ["admin", "shopper", "boutique", "driver"],default:"shopper"  },
    oneTimeCode: { type: String, required: false, default: null },
   
},{ timestamps: true },
 {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
        },
    },
},
    
    
);

module.exports = mongoose.model('User', userSchema);