
const pagination = require("../helpers/pagination");
const Response = require("../helpers/response");
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const slugify = require('slugify');

// create product

const productCreate = async (req, res, next) => {
    
    const { productName, category, inventoryQuantity, color, size,price } = req.body;
    const { productImage1 } = req.files;


   
    const files = [];
    if (req.files) {
        productImage1.forEach((productImage1) => {
        const publicFileUrl = `/images/users/${productImage1.filename}`;
        
        files.push({
          publicFileUrl,
          path: productImage1.filename,
        });
        // console.log(files);
      });
    }


    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

     

        // Check if the user has the "boutique" role
        if (decoded.role !== "boutique") {
            // If the user does not have the "boutique" role, return an error
            return res.status(403).json(Response({ statusCode: 403, message: 'You are not authorized to create products.',status:'faield' }));
        }
        const slug = slugify(productName, { lower: true });
        const newProduct = new Product({
            userId:decoded._id,
            name: productName,
            category: category,
            inventoryQuantity: inventoryQuantity,
            color: JSON.parse(color),
            size: JSON.parse(size),
            price:price,
            images:files,
            firstImage:files[0],
            slug:slug
            
            
        });

        // Save the new product document to the database
        const savedProduct = await newProduct.save();
     

        // After 5 minutes, update isArrival to false
        setTimeout(async () => {
            await Product.findByIdAndUpdate(savedProduct._id, { $set: { isNewArrivel: false } });
        }, 1 * 60 * 1000); // 5 minutes in milliseconds

        // For demonstration purposes, I'm just sending a success response
        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product created successfully",data:{savedProduct} }));
    } catch (error) {
        console.log(error);
        // Handle any errors
        return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error.',status:'server error' }));
    }
};

// product show by user 
const showProductByUser=async(req,res,next)=>{

     // Get the token from the request headers
     const tokenWithBearer = req.headers.authorization;
     let token;
 
     if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
         // Extract the token without the 'Bearer ' prefix
         token = tokenWithBearer.slice(7);
     }
 
     if (!token) {
         return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
     }
 
     try {
         // Verify the token
         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
 
        
 

         const allProductForUser = await Product.find({userId: decoded._id });
       

        // const sumOfRatings = allProductForUser.reduce((total, review) => total + parseInt(review.rating), 0);
        // // Calculate the average rating
        // const averageRating = sumOfRatings / allProductForUser.length;

        
           // For demonstration purposes, I'm just sending a success response
        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "showed all product for the boutique",data:allProductForUser }));
    } catch (error) {
        console.log(error);
        // Handle any errors
        return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error.',status:'server error' }));
    }


}
// show  rest of the product form database
const allProducts=async(req,res,next)=>{
     // for pagination 
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 10;


    try {
        
  

     

        const productslength= await Product.find().countDocuments()
        // if page lent is 0 then call it 
        if (productslength === 0) {
            return res.status(404).json(Response({ statusCode: 404, message: 'this app dosnet have any product.', status: 'failed' }));
        }
        const products= await Product.find()
        .skip((page - 1) * limit)
        .limit(limit);
       
        const paginationOfProduct= pagination(productslength,limit,page)

          // For demonstration purposes, I'm just sending a success response
       res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product show successfully",data:products ,pagination:paginationOfProduct}));
   } catch (error) {
       console.log(error);
       // Handle any errors
       return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error.',status:'server error' }));
   }


}
// const showProductByCategory = async (req, res, next) => {
//       // for pagination 
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
     
  
//     try{
//         const category = req.params.category;
        
//      // i can do two way in this field with catogory or isNewArrivel: true only   
// if(category==="new-arrivals"){
//     const productNewArivel = await Product.find({ category: category, isNewArrivel: { $in: [true, false] } })
//     .populate('userId', 'name image isBlocked')
//     const result=productNewArivel.filter((product)=>!product.userId.isBlocked)
//    console.log(result.length)
   

//     const totalProducts = await Product.find({ category: category,isNewArrivel: { $in: [true, false]} }).countDocuments()
//     const paginationOfProduct= pagination(result.length,limit,page)
//     // response 
//     res.status(200).json(Response({
//         message: "retrive product  successfully by catagory",
//         data: result,
//         pagination:paginationOfProduct
//     }));
//     console.log(productNewArivel,"product is ")
// }else{


    
     
//         const totalProducts = await Product.find({ category: category,isNewArrivel:false  }).countDocuments();

      
//         const products = await Product.find({ category: category,isNewArrivel:false }).populate('userId','name image isBlocked')
//         .skip((page - 1) * limit)
//         .limit(limit);
//      const paginationOfProduct= pagination(totalProducts,limit,page)
//         // response 
//         res.status(200).json(Response({
//             message: "retrive product  successfully by catagory",
//             data: products,
//             pagination:paginationOfProduct
//         }));}
    
//         // res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product show successfully",data:{products} }));
//     } catch (error) {
    const showProductByCategory = async (req, res, next) => {
        // for pagination 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        try {
          const category = req.params.category;
          let products = [];
          let totalProducts = 0;
           // Define the condition for inventory quantity
        const inventoryCondition = { $gt: "0" };
        const updatedForInvertoyQunetity=await Product.find({inventoryQuantity:inventoryCondition,category:category})
          // If no products found, mark the category as not available
          if (updatedForInvertoyQunetity.length === 0) {
            // Mark category as not available
            // await Category.updateOne({ name: category }, { $set: { available: false } });

            // Return a message indicating the category is not available
            return res.status(404).json(Response({
                status:"ok",
                statusCode:404,
                message: `The category '${category}' is not available for viewing.`,
                data: [],
                pagination: null
            }));
        }
      
          // Handle "new-arrivals" category
          if (category === "new-arrivals") {
            // Find products with category "new-arrivals"
            const productNewArrivals = await Product.find({ category: category, isNewArrivel: { $in: [true, false] },inventoryQuantity:inventoryCondition})
              .populate('userId', 'name image isBlocked');
      
            // Filter out products with blocked users
            const filteredProducts = productNewArrivals.filter(product => !product.userId.isBlocked);
            totalProducts = filteredProducts.length;
      
            // Implement pagination on filtered products
            const startIndex = (page - 1) * limit;
            products = filteredProducts.slice(startIndex, startIndex + limit);
      
            const paginationOf= pagination(totalProducts,limit,page)
            // Calculate pagination information
            const paginationOfProduct = {
              totalItems: totalProducts,
              totalPages: Math.ceil(totalProducts / limit),
              currentPage: page,
              pageSize: limit
            };
      
            // Response
            res.status(200).json(Response({
              message: "Retrieved products successfully by category",
              data: products,
              pagination: paginationOf
            }));
      
          } else {
            // Find the total number of products in the specified category (excluding blocked users)
            const allProductsInCategory = await Product.find({ category, isNewArrivel: false ,inventoryQuantity:inventoryCondition})
              .populate('userId', 'name image isBlocked');
            const unblockedProductsInCategory = allProductsInCategory.filter(product => !product.userId.isBlocked);
            totalProducts = unblockedProductsInCategory.length;
      
            // Implement pagination on unblocked products in the specified category
            const startIndex = (page - 1) * limit;
            products = unblockedProductsInCategory.slice(startIndex, startIndex + limit);
      
            // Calculate pagination information
            const paginationOfProduct = {
              totalItems: totalProducts,
              totalPages: Math.ceil(totalProducts / limit),
              currentPage: page,
              pageSize: limit
            };
            const paginationOf= pagination(totalProducts,limit,page)
            // Response
            res.status(200).json(Response({
              message: "Retrieved products successfully by category",
              data: products,
              pagination: paginationOf
            }));
          }
      
        } catch (error) {
          //
      
              // Handle any errors
              return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error.',status:'server error' })); next(error);
    }
}

// product deatils

const ProductDetails=async(req,res,next)=>{

    const { id } = req.query;
    
    try {

        const product=await Product.findById(id).populate('userId');
        
        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product show successfully",data:{product} }));
    } catch (error) {
         // Handle any errors
         return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error.',status:'server error' })); next(error);
        
    }

}

const showProductByUserId=async(req,res,next)=>{
    const id=req.params.id
    // for pagination 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
    
    try {
        const user=await User.findById(id)
        if(!user){
            res.status(400).json(Response({ statusCode: 200, status: "bad request", message: "user not found", }));
        }
        const boutiqueUser={
            name:user.name,
            image:user.image,
            description:user.description,
            rating:user.rating,


        }
       
        const totalProducts = await Product.find({ userId: id }).countDocuments();
        // const totalPages = Math.ceil(totalProducts / perPage);
        const productOfUpdate = await Product.find({ userId: id })

// Filter out products with ratings (excluding those with rating "0")
const ratedProducts = productOfUpdate.filter(product => product.rating !== '0');

// Calculate total rating and count of rated products
let totalRating = 0;
let ratedProductCount = 0;
for (const productOfUpdate of ratedProducts) {
    totalRating += parseFloat(productOfUpdate.rating);
    ratedProductCount++;
}

// Calculate average rating
const averageRating = ratedProductCount > 0 ? totalRating / ratedProductCount : 0;
// Convert average rating to a floating-point number with one decimal place
const formattedRating = parseFloat(averageRating.toFixed(1));
// Update user's rating
 user.rating = formattedRating;

await user.save();

        const products = await Product.find({ userId: id }).populate('userId','name, image')
            .skip((page - 1) * limit)
            .limit(limit);

            


            // call the pagination

            const paginationOfProduct= pagination(totalProducts,limit,page)
            res.status(200).json(Response({
                message: "Events retrieved successfully",
                data: {boutiqueUser,products},
                pagination: paginationOfProduct
            }));
            
    } catch (error) {
       // Handle any errors
       return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error.',status:'server error' })); 
         
    }
}

// under the constraction of lient rivew as per demand
//----------------------##################
//----------------------------------------------------------

const updatedTheProduct = async (req, res, next) => {
    const { productName, category, inventoryQuantity, color, size, price } = req.body;
   

    const files = [];
if (req.files && req.files.productImage1) {
    req.files.productImage1.forEach((productImage) => {
        const publicFileUrl = `/images/users/${productImage.filename}`;
        files.push({
            publicFileUrl,
            path: productImage.filename,
        });
    });
}

    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the user has the "boutique" role
        if (decoded.role !== "boutique") {
            // If the user does not have the "boutique" role, return an error
            return res.status(403).json(Response({ statusCode: 403, message: 'You are not authorized to create products.', status: 'failed' }));
        }
        
        const id = req.params.id;
        const product = await Product.findById(id);
        
        
        // // Update product fields only if provided in the request body
        product.name = productName || product.name;
        product.category = category || product.category;
        product.inventoryQuantity = inventoryQuantity || product.inventoryQuantity;
        product.color = color || product.color;
        product.size = size || product.size;
        product.price = price || product.price;


                // If files is not an empty array, update product.images
                if (files.length > 0) {
                    product.images = files;
                }else{product.images=product.images}

        // Update product.firstImage only if files array is not empty and has the first element
        product.firstImage = (files.length > 0 && files[0]) || product.firstImage;

        // // Update images only if new images are provided
        // if (files.length > 0) {
        //     product.images = files;
        // }

        // Save the updated product
        await product.save();

        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product updated successfully", data: product }));

    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
    }
}


module.exports = {
    productCreate,
    showProductByUser,
    allProducts,
    showProductByCategory,
    showProductByUserId
,ProductDetails,
updatedTheProduct
};
