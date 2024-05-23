const Response = require("../helpers/response")
const Order = require("../models/Order")
const jwt = require("jsonwebtoken");
const OrderItem = require("../models/OrderItem");
const User = require("../models/User");
const Location = require("../models/Location");

// pay order controller 
const makeOreder=async(req,res,next)=>{
    const {items,
        totalAmount,
        status,
        deliveryAddress,
        paymentMethod,serviceFee,
        paymentStatus,tips,shippingFee,tax,boutiqueId}=req.body
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
        orderItems:orderItemsId,
        tax,
        boutiqueId


       }
        const createOrder=await Order.create(orderedProperty)
       

        res.status(200).json(Response({status:"success", message:"ordered successfully", data:createOrder,statusCode:200}))
        
    } catch (error) {
        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
        
    }
}

// update the order statuse new order to in-progress
const orderInProgress=async(req,res,next)=>{
    const id=req.params.id
   

    try {
        const inprogress=await Order.findByIdAndUpdate(id, { status: "inprogress" }, { new: true },)

        res.status(200).json(Response({status:"success",statusCode:200,message:"updated the statuse ",data:inprogress}))

        
    } catch (error) {
        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }

}

// order details 
const orderDetails=async(req,res,next)=>{
    const id=req.params.id

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
    if(!decoded.role==="boutique"){
        res.status(400).json(Response({status:"failed",statusCode:400,message:" your are not boutique " })) 
    }
    const boutique=await Location.findOne({ userId: decoded._id }).populate('userId','image name');



        const detailsOfOrder=await Order.findById(id).populate('orderItems','orederedProduct')

         res.status(200).json(Response({status:"success",statusCode:200,message:"fetched order details ",data:{detailsOfOrder,boutique}}))
    } catch (error) {
        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    
    }
}

// update statuse for assigned driver 
const assignedDriver = async (req, res, next) => {
    const id = req.params.id;
    const boutique = req.query.boutiqueId;

    function calculateDistance(boutique, driver) {
        const R = 6371; // Radius of the Earth in kilometers
        const lat1 = boutique.latitude;
        const lon1 = boutique.longitude;
        const lat2 = driver.latitude;
        const lon2 = driver.longitude;
        const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }

    try { 
        // Boutique location 
        const boutiqueLocation = await User.findById(boutique);
        console.log(boutiqueLocation.currentLocation);
   
        const allDrivers = await User.find({ role: 'driver' });
        const drivers = allDrivers.map(driver => driver.currentLocation);
    

        // Calculate distances and filter drivers within one kilometer
        const nearbyDrivers = drivers.filter(driver => {
            const distance = calculateDistance(boutiqueLocation.currentLocation, driver);
            console.log(distance < 10);
            return distance < 10000; // Filter drivers within one kilometer
        });
        const net=nearbyDrivers.map(tem=>tem.userId)
        console.log(nearbyDrivers.map(tem=>tem.userId));
        const userIds = nearbyDrivers.map(item => item.userId);
        const users = await User.find({ _id: { $in: userIds } });
      console.log(users)

        if (nearbyDrivers.length > 0) {
            // Update the order with the assigned driver
            const driverAssigned = await Order.findByIdAndUpdate(id, { assignedDriver: id }, { new: true });
            res.status(200).json(Response({ status: "success", statusCode: 200, message: "Updated for assigned driver", data: driverAssigned }));
        } else {
            res.status(404).json(Response({ status: "failed", statusCode: 404, message: "No drivers found within one kilometer" }));
        }
    } catch (error) {
        // Server error
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
    }
};

// boutique all orders  showing it in boutique dashbord
const allOrdersOfBoutique=async(req,res,next)=>{

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
    if(!decoded.role==="boutique"){
        res.status(400).json(Response({status:"failed",statusCode:400,message:" your are not boutique " })) 
    }

    const allOrderedProdcutOfboutique=await Order.find({boutiqueId:decoded._id})
   if(allOrderedProdcutOfboutique.length===0){
    res.status(200).json(Response({statusCode:200,status:"ok",message:"your product havent ordered yet ", }))
   }

        res.status(200).json(Response({statusCode:200,status:"ok",message:"fetch alldeta ",data:allOrderedProdcutOfboutique}))
    } catch (error) {
         // server error
         res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}

module.exports={
    makeOreder,
    orderInProgress,
    orderDetails,
    allOrdersOfBoutique,
    assignedDriver
}