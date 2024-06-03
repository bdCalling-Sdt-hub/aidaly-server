const jwt = require('jsonwebtoken');
const Response = require('../helpers/response');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const pagination = require('../helpers/pagination');
const WishListFolder = require('../models/WishListFolder');
const WishlistFolder = require('../models/WishListFolder');

// const createWishList=async(req,res,next)=>{
//     const id=req.params.id
//     console.log(id)
//    // Get the token from the request headers
//    const tokenWithBearer = req.headers.authorization;
//    let token;

//    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//        // Extract the token without the 'Bearer ' prefix
//        token = tokenWithBearer.slice(7);
//    }

//    if (!token) {
//        return res.status(401).json({ success: false, message: 'Token is missing.' });
//    }

//    try {
//     const productId=req.query.id
//        // Verify the token
//        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     //    const product=await Product.findById(id)
//     const wishlistAddedAlredy=await Wishlist.find({userId:decoded._id,productId:productId})
//     if(wishlistAddedAlredy){
//         const removeFromWishList=await Wishlist.findByIdAndDelete()

//     }

//        // response 
//        res.status(200).json(Response({statusCode:200,status:"success", message: "wishlist added", }));

//     } catch (error) {
//         return res.status(500).json({ success: false, message: 'Internal Server Error' });
        
//     }
// }

const createWishList = async (req, res, next) => {
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
    }

    try {
        const productId = req.params.id;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the product is already in the wishlist
        const wishlistItem = await Wishlist.findOne({ userId: decoded._id, productId: productId });
        console.log(wishlistItem)

        if (wishlistItem) {
            // If the product is already in the wishlist, remove it
            await Wishlist.findByIdAndDelete(wishlistItem._id);
            return res.status(200).json(Response({ statusCode: 200, status: "success", message: "Product removed from wishlist." }));
        } else {
            // If the product is not in the wishlist, add it
            const newWishlistItem = new Wishlist({ userId: decoded._id, productId: productId });
            await newWishlistItem.save();
            return res.status(200).json(Response({ statusCode: 200, status: "success", message: "Product added to wishlist.",}));
        }
    } catch (error) {
        // Handle errors properly
        console.error(error);
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}

// get all whishlist product for user 

const getAllWishlist = async (req, res, next) => {
      // for pagination 
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find all wishlist items for the user
        const wishlistItemsLength = await Wishlist.find({ userId: decoded._id }).countDocuments()
             // Check if there are no canceled orders
     if (wishlistItemsLength === 0) {
        return res.status(404).json(Response({
            statusCode: 404,
            status: "failed",
            message: "wishlistItems Length is 0"
        }));
    }

        const wishlistItems = await Wishlist.find({ userId: decoded._id }).populate('productId')
        .skip((page - 1) * limit)
     .limit(limit);

        if (wishlistItems.length === 0) {
            return res.status(200).json(Response({ statusCode: 200, status: "success", message: "You don't have any wishlist product." }));
        }

        const paginationOfProduct= pagination(wishlistItemsLength,limit,page)


        // Return the wishlist items
        res.status(200).json(Response({status:"ok",statusCode:200,message:"get all the wishlist items ",data:wishlistItems,pagination:paginationOfProduct}))
    } catch (error) {
        console.error(error);
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}


// wishlist groupe create by the title 
const createWishListCollection=async(req,res,next)=>{
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //     // Find all wishlist items for the user
    //     const wishlistItemsLength = await Wishlist.find({ userId: decoded._id }).countDocuments()
    //          // Check if there are no canceled orders
    //  if (wishlistItemsLength === 0) {
    //     return res.status(404).json(Response({
    //         statusCode: 404,
    //         status: "failed",
    //         message: "wishlistItems Length is 0"
    //     }));
    // }
const  { title,wishlistId}=req.body

const createFolder=await WishlistFolder.findById

        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))


        
    }
}
module.exports={
    createWishList,
    getAllWishlist
}