const   mongoose  = require("mongoose");



const wishlistSchema=mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    ProductId:{type:mongoose.Schema.Types.ObjectId, ref:"Product", required:true},
    collectionOfWishlistProduct:{type:Object,required:false},
    collectionOfWishlistTitle:{type:String,required:false}
    

})
module.exports = mongoose.model('Wishlist', wishlistSchema);