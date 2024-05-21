const Response = require("../helpers/response")
const Order = require("../models/Order")
const jwt = require("jsonwebtoken");
const OrderItem = require("../models/OrderItem");
const makeOreder=async(req,res,next)=>{
    const {items,
        totalAmount,
        status,
        deliveryAddress,
        paymentMethod,serviceFee,
        paymentStatus,tips,shippingFee,}=req.body
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

       function generateOrderCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        let code = '#';
        
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
    
        return code;
    }
      // Example usage:
    const orderCode = generateOrderCode();
   
    // product ordered 
       const creteProductOrder=await OrderItem.create({orederedProduct:items,orderId:orderCode})
    
       const orderItemsId=await OrderItem.findOne({orderId:orderCode})

       const orderedProperty={
        userId:decoded._id,
        
        totalAmount,
        status,
        deliveryAddress,
        paymentMethod,
        paymentStatus,
        tips,
        shippingFee,
        orderId:orderCode,
        serviceFee,
        orderItems:orderItemsId


       }
        const createOrder=await Order.create(orderedProperty)
       

        res.status(200).json(Response({status:"success", message:"ordered successfully", data:createOrder,statusCode:200}))
        
    } catch (error) {
        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
        
    }
}

module.exports={
    makeOreder
}