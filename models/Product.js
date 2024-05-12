const mongoose = require('mongoose');

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
    category: {
        type: String,
        required: true
    },
   
    images: [{
        type: Object,
        required: true
    }],
    inventoryQuantity: {
        type: String,
        default: "0"
    },
    
   
    
    color: [{
      type:String, required:true
    }],
   size:[{type:String,required:true}],
    rating: {
        type: String,
        default: "0"
    },
    reviews: [{type:mongoose.Schema.Types.ObjectId,ref:'Reviews',required:false}],
    wishlist: {
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