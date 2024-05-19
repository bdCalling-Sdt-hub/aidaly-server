
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
const allProducts=async(_req,res,next)=>{


    try {
        
  

     

        const products= await Product.find();
       

          // For demonstration purposes, I'm just sending a success response
       res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product show successfully",data:{products} }));
   } catch (error) {
       console.log(error);
       // Handle any errors
       return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error.',status:'server error' }));
   }


}
const showProductByCategory = async (req, res, next) => {
      // for pagination 
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
     
  
    try{
        const category = req.params.category;
        console.log(category)
      
        const totalProducts = await Product.find({ category: category  }).countDocuments();

      
        const products = await Product.find({ category: category }).populate('userId','name image')
        .skip((page - 1) * limit)
        .limit(limit);
     const paginationOfProduct= pagination(totalProducts,limit,page)
        // response 
        res.status(200).json(Response({
            message: "retrive product  successfully by catagory",
            data: products,
            pagination:paginationOfProduct
        }));
    
        // res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product show successfully",data:{products} }));
    } catch (error) {
              // Handle any errors
              return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error.',status:'server error' })); next(error);
    }
}

// product deatils

const ProductDetails=async(req,res,next)=>{

    const { id } = req.query;
    
    try {

        const product=await Product.findById(id).populate('userId','name image');
        
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

        const products = await Product.find({ userId: id }).populate('userId','name image')
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


module.exports = {
    productCreate,
    showProductByUser,
    allProducts,
    showProductByCategory,
    showProductByUserId
,ProductDetails};
