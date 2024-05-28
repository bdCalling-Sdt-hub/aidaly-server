const Response = require("../helpers/response")
const Order = require("../models/Order")
const jwt = require("jsonwebtoken");
const OrderItem = require("../models/OrderItem");
const User = require("../models/User");
const Location = require("../models/Location");
const pagination = require("../helpers/pagination");
const Product = require("../models/Product");
const Cancelled = require("../models/Cancelled");

const showDriverDashBored=async(req,res,next)=>{
// for pagination 
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
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
     if(!decoded._id==="drver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not boutique.',status:'faield' }));
     }

const driverGetOrder=await Order.find({assignedDriver:decoded._id})
const activeOrders = await Order.find({ assignedDriver: decoded._id, status: "inprogress" });

let totalAmount = 0;

activeOrders.forEach(order => {
    totalAmount += parseFloat(order.totalAmount.replace(/[^\d.]/g, ''));

});
console.log(totalAmount)
    
        
const paginationOfProduct= pagination(driverGetOrder.length,limit,page)
res.status(200).json(Response({
    message: "order showed succesfully",
    status:"success",
    statusCode:200,
    data: driverGetOrder,
    pagination: paginationOfProduct
}));
    } catch (error) {
        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}

const cancelledOrderedAsDriver=async(req,res,next)=>{
    id=req.params.id
    
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
     if(!decoded._id==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }
    const checktheDriver=await Order.findById(id)
    console.log(checktheDriver,"this is comenn")
    if(checktheDriver.assignedDriver===null){
      return  res.status(400).json(Response({statusCode:400,status:"faild",message:"driver is not yet assigned "}))

    }
    if(checktheDriver.assignedDriver.toString()!==decoded._id){
        return  res.status(400).json(Response({statusCode:400,status:"faild",message:"you are not this driver "}))

    }
    // console.log(checktheDriver.assignedDriver.toString()===decoded._id)
    const drivercancelOrder=await Order.findByIdAndUpdate(id,{assignedDriver:null,status:"inprogress"}, {new:true})
    const cancleorder =await Cancelled.create({orderId:id,userId:decoded._id,boutiqueId:drivercancelOrder.boutiqueId})
    console.log(decoded._id)
    console.log(drivercancelOrder.boutiqueId)
    res.status(200).json(Response({status:"ok",statusCode:200,message:"driver cancelled the order",data:cancleorder}))
        
    } catch (error) {
        
    
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}
// show all order that you cancelled
const showAllCancellOrder=async(req,res,next)=>{
    // for pagination 
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
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
     if(!decoded._id==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }

     const allCanseledOrdercount=await Cancelled.find({userId:decoded._id}).populate('orderId boutiqueId').countDocuments()
     // Check if there are no canceled orders
     if (allCanseledOrdercount === 0) {
        return res.status(404).json(Response({
            statusCode: 404,
            status: "failed",
            message: "No canceled orders available."
        }));
    }

     const allCanseledOrder=await Cancelled.find({userId:decoded._id}).populate('orderId boutiqueId')
     .skip((page - 1) * limit)
     .limit(limit);

     console.log(allCanseledOrder,allCanseledOrdercount)
    //  const paginationOfProduct= pagination(allCanseledOrdercount,limit,page)

     res.status(200).json(Response({
        statusCode:200,
        status:"ok",
        message:"all cancelled order retrive",
        data:allCanseledOrder,
        // pagination:paginationOfProduct
        

     }))

        
    } catch (error) {

        
    
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}
const showNewOrderForDriver=async(req,res,next)=>{

    // for pagination 
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
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
     if(!decoded._id==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }
const user= await User.findById(decoded._id)
if(!user.assignedDriverProgress==="newOrder"){
    return res.status(401).json(Response({ statusCode: 401, message: 'this is not new order .',status:'faield' }));
 
}
        const allCanseledOrdercount=await Order.find({assignedDriver:decoded._id}).populate("boutiqueId orderItems").countDocuments()
        // Check if there are no canceled orders
     if (allCanseledOrdercount === 0) {
        return res.status(404).json(Response({
            statusCode: 404,
            status: "failed",
            message: "No  orders available for driver."
        }));
    }

        const newOrder=await Order.find({assignedDriver:decoded._id}).populate("boutiqueId orderItems")
        .skip((page - 1) * limit)
     .limit(limit);
        // const botiq=newOrder.map(order=>order.boutiqueId)
              const paginationOfProduct= pagination(allCanseledOrdercount,limit,page)

        console.log(newOrder,decoded._id)
        res.status(200).json(Response({
            statusCode:200,
            status:"ok",
            message:"all driver new order  retrive",
            data:newOrder,
            pagination:paginationOfProduct
         }))
        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
 
    }
}
const newOrderToProgress=async(req,res,next)=>{
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
     if(!decoded._id==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }
// see if this driver is authentic
        const updateToProgress=await Order.findById(id)
        if(updateToProgress.assignedDriver===null){
            return  res.status(400).json(Response({statusCode:400,status:"faild",message:"driver is not yet assigned "}))
      
          }
          if(updateToProgress.assignedDriver.toString()!==decoded._id){
              return  res.status(400).json(Response({statusCode:400,status:"faild",message:"you are not this driver "}))
      
          }
        console.log(updateToProgress)
        const assigndriverId= updateToProgress.assignedDriver
         const exisist=await User.findById(assigndriverId)
         console.log(exisist.assignedDriverProgress==="inprogress")
         // Check if the driver's progress is already "inprogress"
         if (exisist.assignedDriverProgress === "inprogress") {
            return res.status(400).json(Response({
                statusCode: 400,
                status: "failed",
                message: "Driver's progress is already in progress."
            }));
        }
        const updateDrivertoProgress=await User.findByIdAndUpdate(assigndriverId,{assignedDriverProgress:"inprogress"},{new:true})

        console.log()

        res.status(200).json(Response({statusCode:200,status:"ok",message:"updateed " ,data:updateDrivertoProgress}))
        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
 
    }
}
const getAllinprogressOrderForDriver=async(req,res,next)=>{
     // for pagination 
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
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
     if(!decoded._id==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }


     const getAllInprogresOrder=await Order.find({assignedDriver:decoded._id})
     // Check if the driver's progress is already "inprogress"
     if (getAllInprogresOrder.assignedDriverProgress !== "inprogress") {
        return res.status(400).json(Response({
            statusCode: 400,
            status: "failed",
            message: "your order statuse is not right ."
        }));
    }
     console.log(getAllInprogresOrder)
     res.status(200).json(Response({
        statusCode:200,
        status:"ok",
        message:"retrive all inprogress data",
        data:getAllInprogresOrder
     }))

        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))

    }
}
module.exports={
    showDriverDashBored,
    cancelledOrderedAsDriver,
    showAllCancellOrder,
    showNewOrderForDriver,
    newOrderToProgress,
    getAllinprogressOrderForDriver
}