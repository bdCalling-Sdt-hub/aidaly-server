const mongoose = require('mongoose');
const Review = require('./Reviews');

const productSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    name: {
        type: String,
        required: true
    },
    
    price: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
   
    
   
    images: [{
        type: Object,
        required: true
    }],
    firstImage:{type:Object, required:false},
    inventoryQuantity: {
        type: String,
        default: "0"
    },
    
   
    
//     color: {
//       type:[], required:true
//     },
//    size:[{type:String,required:true}],
color: {
    type: Array, // Array of strings
    required: true,
     // Default empty array if not provided
},
size: {
    type: Array, // Array of strings
    required: true,
     // Default empty array if not provided
}
// if add like this i could handel the size and quentity 
// size: [
//     {
//         size:{type:String,required:true},
//         price:{type:String,required:true},
//         quantity:{type:String,required:true}
//     }
// ]
 ,
    rating: {
        type: String,
        default: "0"
    },
    reviews: {type:String,required:false,default:"0"},
    wishlist: {
        type: Boolean,
        default: false
    },
    isAproved: {
        type: Boolean,
        default: false
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isNewArrivel:{type:Boolean,default:true}
    // shippingInfo: {
    //     weight: Number,
    //     dimensions: {
    //         length: Number,
    //         width: Number,
    //         height: Number
    //     }
    // },
    // promotionalPrice: {
    //     type: Number,
    //     default: null
    // },
    // customFields: {
    //     type: Map,
    //     of: String
    // }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

// this is the feadback model

// const mongoose = require('mongoose');

// const variantSchema = new mongoose.Schema({
//   size: String,
//   color: String,
//   inventoryQuantity: Number,
//   price: Number
// });

// const productSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   category: String,
//   variants: [variantSchema]
// });

// module.exports = mongoose.model('Product', productSchema);
