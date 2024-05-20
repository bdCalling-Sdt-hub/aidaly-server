const Response = require("../helpers/response")
const Order = require("../models/Order")
const jwt = require("jsonwebtoken");
const makeOreder=async(req,res,next)=>{
    const {items,
        totalAmount,
        status,
        deliveryAddress,
        paymentMethod,
        paymentStatus}=req.body
console.log(req.body)
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
      
       const orderedProperty={
        userId:decoded._id,
        items,
        totalAmount,
        status,
        deliveryAddress,
        paymentMethod,
        paymentStatus


       }


        const createOrder=await Order.create(orderedProperty)
        console.log(createOrder)

        res.status(200).json(Response({status:"success", message:"ordered successfully", data:createOrder,statusCode:200}))
        
    } catch (error) {
        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
        
    }
}

module.exports={
    makeOreder
}