const Response = require("../helpers/response");
const Product = require("../models/Product");
const Review = require("../models/Reviews");
const jwt = require("jsonwebtoken");
 

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
        console.log(saveReview,"save revie")
        
        // // Find the product by its ID
        // const product = await Product.findById(req.params.id);

        // if (!product) {
        //     throw new Error('Product not found');
        // }

        // // Push the newly created review to the product's reviews array
        // product.reviews.push(newReview);

        // // Save the updated product
        // await product.save();
         // Update the product's reviews array with the new review's ID
        //  await Product.findByIdAndUpdate(req.params.id, { $push: { reviews: saveReview._id } });
        //  console.log(saveReview,"this is review id")
       
        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "review add successfully ",data:saveReview}));
    }catch(error){
       // Handle any errors
       return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error .',status:'server error' }));
    }
 }

 // show all review for this product
 const showAllReciewForProduct=async(req,res,next)=>{
  const productId=req.params.id

try {
   // Find all reviews that reference the specified product ID
   const reviews = await Review.find({ productId });
   console.log(reviews)
   res.status(200).json(Response({ statusCode: 200, status: "ok", message: "you can see your product  ",data:reviews}));
} catch (error) {
  // Handle any errors
       return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error .',status:'server error' }));
}


 }

 module.exports={
    createRewiew,
    showAllReciewForProduct
 }