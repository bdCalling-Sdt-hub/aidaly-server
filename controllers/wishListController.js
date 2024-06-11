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
        const {productId} = req.body;
        console.log(productId)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the product is already in the wishlist
        const wishlistItem = await Wishlist.findOne({ userId: decoded._id, productId: productId, });
        console.log(wishlistItem)

        if (wishlistItem) {
            // If the product is already in the wishlist, remove it
            await Wishlist.findByIdAndDelete(wishlistItem._id);
            await Product.findByIdAndUpdate(productId, { $set: { wishlist: false } });

            return res.status(200).json(Response({ statusCode: 200, status: "success", message: "Product removed from wishlist." }));
        } else {
            // If the product is not in the wishlist, add it
            const newWishlistItem = new Wishlist({ userId: decoded._id, productId: productId });
            await newWishlistItem.save();
            await Product.findByIdAndUpdate(productId, { $set: { wishlist: true } });

            return res.status(200).json(Response({ statusCode: 200, status: "success", message: "Product added to wishlist.",}));
        }
    } catch (error) {
        // Handle errors properly
        console.error(error);
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}

// get all whishlist product for user 

// const getAllWishlist = async (req, res, next) => {
//       // for pagination 
// const page = parseInt(req.query.page) || 1;
// const limit = parseInt(req.query.limit) || 10;
//     const tokenWithBearer = req.headers.authorization;
//     let token;

//     if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//         token = tokenWithBearer.slice(7);
//     }

//     if (!token) {
//         return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//         // Find all wishlist items for the user
//         const wishlistItemsLength = await Wishlist.find({ userId: decoded._id }).countDocuments()
//              // Check if there are no canceled orders
//      if (wishlistItemsLength === 0) {
//         return res.status(404).json(Response({
//             statusCode: 404,
//             status: "failed",
//             message: "wishlistItems Length is 0"
//         }));
//     }
//     const wishlisttIdFormFolder=await WishListFolder.find({userId:decoded._id})
//     console.log(wishlisttIdFormFolder,decoded)

//         const wishlistItems = await Wishlist.find({ userId: decoded._id }).populate('productId')
//         .skip((page - 1) * limit)
//      .limit(limit);

//         if (wishlistItems.length === 0) {
//             return res.status(200).json(Response({ statusCode: 200, status: "success", message: "You don't have any wishlist product." }));
//         }

//         const paginationOfProduct= pagination(wishlistItemsLength,limit,page)


//         // Return the wishlist items
//         res.status(200).json(Response({status:"ok",statusCode:200,message:"get all the wishlist items ",data:wishlistItems,pagination:paginationOfProduct}))
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
//     }
// }
const getAllWishlist = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find all wishlist items for the user
        const wishlistItems = await Wishlist.find({ userId: decoded._id }) .populate({
            path: 'productId',
            populate: {
                path: 'userId'
            }
        
        })
            .skip((page - 1) * limit)
            .limit(limit);

        if (wishlistItems.length === 0) {
            return res.status(200).json(Response({ statusCode: 200, status: "success", message: "You don't have any wishlist product." }));
        }

        // Fetch wishlist items from wishlistFolder collection
        const wishlistFolderItems = await WishlistFolder.find({ userId: decoded._id });

        // Extract wishlist IDs from wishlistFolderItems
const wishlistFolderIds = wishlistFolderItems.flatMap(item => item.collectionOfProducts.map(product => product.wishlistId.toString()));

// Filter out wishlist items that are not in the wishlistFolder collection
const filteredWishlistItems = wishlistItems.filter(item => {
    // Check if any wishlist ID matches the current item's ID
    return !wishlistFolderIds.includes(item._id.toString());
});
if(filteredWishlistItems.length===0){
    return res.status(404).json(Response({statusCode:404,status:"success",message:"you have data but in wishlist folder"}))
}

        const paginationOfProduct= pagination(filteredWishlistItems.length,limit,page)

        console.log(wishlistFolderIds,filteredWishlistItems)
        // Return the filtered wishlist items
        res.status(200).json(Response({
            status: "ok",
            statusCode: 200,
            message: "Get all the wishlist items",
            data: filteredWishlistItems,
            pagination:paginationOfProduct
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
    }
}


// wishlist groupe create by the title 
// const createWishListCollection=async(req,res,next)=>{
//     const tokenWithBearer = req.headers.authorization;
//     let token;

//     if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//         token = tokenWithBearer.slice(7);
//     }

//     if (!token) {
//         return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     //     // Find all wishlist items for the user
//     //     const wishlistItemsLength = await Wishlist.find({ userId: decoded._id }).countDocuments()
//     //          // Check if there are no canceled orders
//     //  if (wishlistItemsLength === 0) {
//     //     return res.status(404).json(Response({
//     //         statusCode: 404,
//     //         status: "failed",
//     //         message: "wishlistItems Length is 0"
//     //     }));
//     // }
// const  { wishlistTitle,collectionOfProducts}=req.body

// const folder={ userId:decoded._id,wishlistTitle,collectionOfProducts}
// // const wishlistUpdate=await Wishlist.findan

// const createFolder=await WishlistFolder.create(folder)
// res.status(200).json(Response({status:"ok",statusCode:200,message:"get all the wishlist items ",data:createFolder}))

        
//     } catch (error) {
//         res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))


        
//     }
// }
const createWishListCollection = async (req, res, next) => {
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { wishlistTitle, collectionOfProducts } = req.body;

        // Check if a wishlist folder with the same title already exists for the user
        let wishlistFolder = await WishlistFolder.findOne({ userId: decoded._id, wishlistTitle });

        if (wishlistFolder) {
            // If the wishlist folder already exists, update its collectionOfProducts
            wishlistFolder.collectionOfProducts = wishlistFolder.collectionOfProducts = wishlistFolder.collectionOfProducts.concat(collectionOfProducts);
            ;
            await wishlistFolder.save();
        } else {
            // If the wishlist folder doesn't exist, create a new one
            wishlistFolder = await WishlistFolder.create({ userId: decoded._id, wishlistTitle, collectionOfProducts });
        }

        res.status(200).json(Response({ status: 'ok', statusCode: 200, message: 'Wishlist collection created/updated successfully.', data: wishlistFolder }));
    } catch (error) {
        res.status(500).json(Response({ status: 'failed', message: error.message, statusCode: 500 }));
    }
}

// get all wishlist by folder
const showWishlistFolderByName = async (req, res) => {
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { name } = req.query;

        if (!name) {
            return res.status(400).json(Response({ message: 'Folder name is required.' }));
        }

        // Find the wishlist folder by name
        const wishlistFolder = await WishlistFolder.findOne({ wishlistTitle: name, userId:decoded._id}).populate("collectionOfProducts")
        .populate({
            path: 'collectionOfProducts',
            populate: {
                path: 'wishlistId',
                populate: {
                    path: 'productId', // Add additional nested population here if needed
                    populate:{
                       path: 'userId'
                    }
                }
            }
        });

        if (!wishlistFolder) {
            return res.status(404).json(Response({ statusCode:404,message: 'Wishlist folder not found.' }));
        }

        return res.status(200).json(Response({ message: 'Wishlist folder found.', data: wishlistFolder }));
    } catch (error) {
        console.error('Error showing wishlist folder by name:', error);
        return res.status(500).json(Response({ message: error.message, }));
    }
};

// get all folder name

const getFoldername=async(req,res,next)=>{
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const getFolder = await WishListFolder.find({ userId: decoded._id });
          const names = getFolder.map(folder => folder.wishlistTitle);
            console.log(names);

        return res.status(200).json(Response({ message: 'Wishlist folder found.', data: names }));

        
    } catch (error) {
        return res.status(500).json(Response({ message: 'Internal server error.' }));

        
    }
}

module.exports={
    createWishList,
    getAllWishlist,
    createWishListCollection,
    showWishlistFolderByName,
    getFoldername
}