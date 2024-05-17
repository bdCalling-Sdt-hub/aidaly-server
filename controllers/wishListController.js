const jwt = require('jsonwebtoken');
const Response = require('../helpers/response');
const Product = require('../models/Product');

const createWishList=async(req,res,next)=>{
    const id=req.params.id
    console.log(id)
   // Get the token from the request headers
   const tokenWithBearer = req.headers.authorization;
   let token;

   if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
       // Extract the token without the 'Bearer ' prefix
       token = tokenWithBearer.slice(7);
   }

   if (!token) {
       return res.status(401).json({ success: false, message: 'Token is missing.' });
   }

   try {
       // Verify the token
       const decoded = await new Promise((resolve, reject) => {
           jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
               if (err) reject(err);
               else resolve(decoded);
           });
       });
    //    const product=await Product.findById(id)

       // response 
       res.status(200).json(Response({statusCode:200,status:"success", message: "wishlist added", }));

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
        
    }
}

module.exports={
    createWishList
}