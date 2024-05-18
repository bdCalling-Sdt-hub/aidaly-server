const Response = require("../helpers/response");
const Product = require("../models/Product");
const Review = require("../models/Reviews");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const pagination = require("../helpers/pagination");
 

 const createRewiew=async (req, res, next)=>{
    const { rating, height, weight,reviews } = req.body;
    const { reviewImage } = req.files;
 
   const id=req.params.id

  
    const files = [];
    if (req.files) {
        reviewImage.forEach((reviewImage) => {
        const publicFileUrl = `/images/users/${reviewImage.filename}`;
        
        files.push({
          publicFileUrl,
          path: reviewImage.filename,
        });
        // console.log(files);
      });
    }
    console.log(files)
  
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

       const isProduct=await Product.findById(id)
       if(!isProduct){
         return res.status(404).json(Response({ statusCode: 401, message: 'product not found to review.',status:'faield' }));
       }
       console.log(isProduct,"this is product id")

        const newReview={
          userId:decoded._id,
          rating:rating,
          height:height,
          weight:weight,
          reviews:reviews,
          reviewImage:files,
          ProductId:id

        }

     
       
        const saveReview =await Review.create(newReview)
     
        
      
       
        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "review add successfully ",data:saveReview}));
    }catch(error){
       // Handle any errors
       return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error .',status:'server error' }));
    }
 }

 // show all review for this product
 const showAllReciewForProduct=async(req,res,next)=>{
  const productId=req.params.id
  // for pagination 
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;


try {
   const isProduct=await Product.findById(productId)
   if(!isProduct){
     return res.status(404).json(Response({ statusCode: 401, message: 'you dont have any product',status:'faield' }));
   }
   
   // Find all reviews that reference the specified product ID
   const reviews = await Review.find({ProductId:productId}).populate('userId','name image ')
   .skip((page - 1) * limit)
        .limit(limit);

   const totalreviews = await Review.find({ ProductId: productId  }).countDocuments();
   

   if (reviews.length === 0) {
    // If no reviews found for the product, return an error response
    return res.status(404).json(Response({ statusCode: 404, message: 'Product dosent have review yet.', status: 'error' }));
}
  
const sumOfRatings = reviews.reduce((total, review) => total + parseInt(review.rating), 0);
// Calculate the average rating
const averageRating = sumOfRatings / reviews.length;



 await Product.findByIdAndUpdate(productId, { rating: averageRating.toFixed(2) }, { new: true });
// await product.save()
    // call the pagination
    const paginationOfProduct= pagination(totalreviews,limit,page)
 // response 
 res.status(200).json(Response({
  message: "retrive product  successfully by catagory",
  data: reviews,
  pagination:paginationOfProduct
}));
  //  res.status(200).json(Response({ statusCode: 200, status: "ok", message: "you can see your product  ",data:{reviews}}));
} catch (error) {
  // Handle any errors
       return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error .',status:'server error' }));
}


 }
 const updateRatingForboutique=async(req,res,next)=>{
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
       console.log()

      

       res.status(200).json(Response({ statusCode: 200, status: "ok", message: "you can see your product  ",}));
   } catch (error) {
      // Handle any errors
      return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error .',status:'server error' }));
   }


 }

 module.exports={
    createRewiew,
    showAllReciewForProduct,
    updateRatingForboutique
 }