
const Response = require("../helpers/response");
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


// create product

const productCreate = async (req, res, next) => {
    console.log(req.body);
    const { productName, category, inventoryQuantity,firstImage, color, size,price } = req.body;
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
    console.log(files,"new file")

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
            images:files,
            firstImage:files[0]
            
            
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
// show  rest of the product form database
const allProducs=async(_req,res,next)=>{


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

module.exports = {
    productCreate,
    showProductByUser,allProducs
};
