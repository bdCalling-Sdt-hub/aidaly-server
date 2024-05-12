
const Response = require("../helpers/response");
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


// create product

const productCreate = async (req, res, next) => {
    console.log(req.body);
    const { productName, category, inventoryQuantity, color, size,price } = req.body;
    const { productImage1 } = req.files;
    console.log(productImage1.length,"product image")

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

        console.log(decoded._id, "this role");

        // Check if the user has the "boutique" role
        if (decoded.role !== "boutique") {
            // If the user does not have the "boutique" role, return an error
            return res.status(403).json(Response({ statusCode: 403, message: 'You are not authorized to create products.',status:'faield' }));
        }

        const newProduct = new Product({
            userId:decoded._id,
            name: productName,
            category: category,
            inventoryQuantity: inventoryQuantity,
            color: color,
            size: size,
            price:price,
            images:productImage1
            
            // Add logic to handle image uploads and store image URLs in the product document
            // For example, you might save the images to a file system or cloud storage and store the URLs in the product document
            // images: imageUrls
        });

        // Save the new product document to the database
        const savedProduct = await newProduct.save();

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
 
         console.log(decoded.role, "this role");
 
      

         const allProductForUser = await Product.find({userId: decoded._id });
        

           // For demonstration purposes, I'm just sending a success response
        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product created successfully",data:{allProductForUser} }));
    } catch (error) {
        console.log(error);
        // Handle any errors
        return res.status(500).json(Response({ statusCode: 500, message: 'Internal server error.',status:'server error' }));
    }


}

module.exports = {
    productCreate,
    showProductByUser
};
