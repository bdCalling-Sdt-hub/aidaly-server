const Response = require("../helpers/response")
const Order = require("../models/Order")
const jwt = require("jsonwebtoken");

const pagination = require("../helpers/pagination");
const Cancelled = require("../models/Cancelled");
const User = require("../models/User");

// tracking controller for driver tracking
//--------------##################
// get openTracker

const openTrackerOfGet=async(req,res,next)=>{
    
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
     if(!decoded.role==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }
        const id=req.params.id
        const findOrder=await Order.findById(id)
        // const user=await User.findById(decoded._id)
        // console.log(user.assignedDrivertrack===null)
        // if(findOrder.assignedDrivertrack!==null){
        //      res.status(404).json(Response({ statusCode: 404, message: 'you are assinged for diffrent track statuse.',status:'faield' }));
 

        // }else{
        
        
        // const findDrivertoupdatePickup=await User.findByIdAndUpdate(findOrder.assignedDriver,{assignedDrivertrack:"waytoPickup"},{new:true})
        const findOrdertoTrac=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')


        res.status(200).json(Response({statusCode:200,status:"ok",message:"opend the tracker ",data:findOrdertoTrac}))
        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
 
    }


}
// open tracker controller--------
// /---------------------##----------
// const openTracker=async(req,res,next)=>{
//     // Get the token from the request headers
//  const tokenWithBearer = req.headers.authorization;
//  let token;

//  if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//      // Extract the token without the 'Bearer ' prefix
//      token = tokenWithBearer.slice(7);
//  }

//  if (!token) {
//      return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
//  }

//  try {
//      // Verify the token
//      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//      if(!decoded._id==="driver"){
//       return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
//      }
//         const id=req.params.id
//         const findOrder=await Order.findById(id)
//         // const user=await User.findById(decoded._id)
//         if(findOrder.assignedDrivertrack!==null){
//             return res.status(404).json(Response({ statusCode: 404, message: 'you are assinged for diffrent track statuse.',status:'faield' }));
 

//         }
//         console.log(findOrder.assignedDriver)
//         const findDrivertoupdatePickup=await Order.findByIdAndUpdate(id,{assignedDrivertrack:"waytoPickup"},{new:true})
//         const findOrdertoTrac=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')


//         res.status(200).json(Response({statusCode:200,status:"ok",message:"opend the tracker ",data:findOrdertoTrac}))
//     } catch (error) {
//         res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
 
//     }
// }
const openTracker = async (req, res, next) => {
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }
    

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded)
        
        if (decoded.role !== "driver") {
            return res.status(404).json(Response({ statusCode: 404, message: 'You are not a driver.', status: 'failed' }));
        }
        console.log(decoded,)

        const id = req.params.id;
        const { driverTrack } = req.body; // Assuming driverTrack is the status sent in the request body

        const findOrder = await Order.findById(id);
        console.log(driverTrack)

        // if (findOrder.assignedDrivertrack ===driverTrack) {
        //     return res.status(404).json(Response({ statusCode: 404, message: 'You are assigned for a  this tracking already.', status: 'failed' }));
        // }

        let updatedOrder;

        if (driverTrack === 'orderDelivered') {
            // If the driver track is 'orderDelivered', update all associated data
            updatedOrder = await Order.findByIdAndUpdate(id, { 
                assignedDrivertrack: driverTrack,
                assignedDriverProgress: "deliveried", // Assuming this is the next stage after delivering
                status: "delivered" // Assuming the overall status is 'delivered' after delivering
            }, { new: true });

            // Update associated boutique
            const findDrivertoupdatoarriveStore=await Order.findByIdAndUpdate(id,{assignedDrivertrack:"orderDelivered"},{new:true})

        const  updateOrderDeliverforDriver=await Order.findByIdAndUpdate(id,{assignedDriverProgress:"deliveried",status:"delivered"},{new:true})

        } else {
            // Otherwise, update only the driver track
            updatedOrder = await Order.findByIdAndUpdate(id, { assignedDrivertrack: driverTrack }, { new: true });
        }

        const findOrderToTrack = await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver');

        //  -------------
        // /###################

//         const findDriverToUpdatePickup = await Order.findByIdAndUpdate(id, { assignedDrivertrack: driverTrack }, { new: true });
//         const findOrderToTrack = await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver');
// console.log(driverTrack)

        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Opened the tracker", data: findOrderToTrack }));
    } catch (error) {
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
    }
}

// way to pickup the order by driver
// /-----------##-----------=-----

const wayToPickupDriver=async(req,res,next)=>{

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
     if(!decoded.role==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }
        const id=req.params.id
        const findOrder=await Order.findById(id)
        // const user=await User.findById(decoded._id)

        if(findOrder.assignedDrivertrack!=="waytoPickup"){
            return res.status(404).json(Response({ statusCode: 404, message: 'you are assinged for diffrent track statuse.',status:'faield' }));
 

        }
        const findDrivertoupdatoarriveStore=await Order.findByIdAndUpdate(id,{assignedDrivertrack:"arrivedtheStore"},{new:true})

        const orderTracktoarrived=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')


        res.status(200).json(Response({statusCode:200,status:"ok",message:"opend the tracker ",data:orderTracktoarrived}))
        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
        
    }
}
// order picked by driver 
//--------------##-----------
const orderPicked=async(req,res,next)=>{

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
     if(!decoded.role==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }
        const id=req.params.id
        const findOrder=await Order.findById(id)
        // const user=await User.findById(decoded._id)

        if(findOrder.assignedDrivertrack!=="arrivedtheStore"){
            return res.status(404).json(Response({ statusCode: 404, message: 'you are assinged for diffrent track statuse.',status:'faield' }));
 

        }
        const findDrivertoupdatoarriveStore=await Order.findByIdAndUpdate(id,{assignedDrivertrack:"orderPicked"},{new:true})

        const orderPickedFromBoutique=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')


        res.status(200).json(Response({statusCode:200,status:"ok",message:"opend the tracker ",data:orderPickedFromBoutique}))
        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
        
    }
}
// on the way to deliver the order 
//--------------##-----------
const onTheWayToDeliver=async(req,res,next)=>{

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
     if(!decoded.role==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }
        const id=req.params.id
        const findOrder=await Order.findById(id)
        // const user=await User.findById(decoded._id)

        if(findOrder.assignedDrivertrack!=="orderPicked"){
            return res.status(404).json(Response({ statusCode: 404, message: 'you are assinged for diffrent track statuse.',status:'faield' }));
 

        }
        const findDrivertoupdatoarriveStore=await Order.findByIdAndUpdate(id,{assignedDrivertrack:"waytodeliver"},{new:true})
        console.log(findDrivertoupdatoarriveStore)

        const onthewayTodeliver=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')


        res.status(200).json(Response({statusCode:200,status:"ok",message:"opend the tracker ",data:onthewayTodeliver}))
        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
        
    }
}
// arrived to location 
const arrivedAtlocation=async(req,res,next)=>{

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
     if(!decoded.role==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }
        const id=req.params.id
        const findOrder=await Order.findById(id)
        // const user=await User.findById(decoded._id)

        if(findOrder.assignedDrivertrack!=="waytodeliver"){
            return res.status(404).json(Response({ statusCode: 404, message: 'you are assinged for diffrent track statuse.',status:'faield' }));
 

        }
        const findDrivertoupdatoarriveStore=await Order.findByIdAndUpdate(id,{assignedDrivertrack:"arrivedAtLocation"},{new:true})

        const arrivedLocation=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')


        res.status(200).json(Response({statusCode:200,status:"ok",message:"opend the tracker ",data:arrivedLocation}))
        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
        
    }
}

// deliver the order finaly every user asociate of order will accept the delivery
//---------------------##-------------------------------

const orderDelivered=async(req,res,next)=>{
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
     if(!decoded.role==="driver"){
      return res.status(401).json(Response({ statusCode: 401, message: 'you are not driver.',status:'faield' }));
     }
        const id=req.params.id

        const findOrder=await Order.findById(id)
        // const user=await User.findById(decoded._id)

        if(user.assignedDrivertrack!=="arrivedAtLocation"){
            return res.status(404).json(Response({ statusCode: 404, message: 'you are assinged for diffrent track statuse.',status:'faield' }));
 

        }
        // const orderedProduct=await Order.findById(id)
        
        const findDrivertoupdatoarriveStore=await Order.findByIdAndUpdate(id,{assignedDrivertrack:"orderDelivered"},{new:true})

        const  updateOrderDeliverforDriver=await Order.findByIdAndUpdate(id,{assignedDriverProgress:"deliveried",status:"delivered"},{new:true})

        const orderDelivered=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')
        res.status(200).json(Response({statusCode:200,status:"ok",message:"delivery the order  ",data:orderDelivered}))

    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))

        
    }
}




// boutique will tracking the driver 
//--------------------####-------------

const boutiqueTrackingDriver=async(req,res,next)=>{
    try {
        // order ID
        const id=req.params.id
        
        const drivertrackingByOrder=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')
        console.log(drivertrackingByOrder)

        if(drivertrackingByOrder.assignedDrivertrack==="waytoPickup"){
            const drivertrackingByOrders=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')

           return  res.status(200).json(Response({statusCode:200,status:"ok",message:"driver is on the way to pickup the order ",data:drivertrackingByOrders}))
        }
        if(drivertrackingByOrder.assignedDrivertrack==="arrivedtheStore"){
            const drivertrackingByOrders=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')

           return  res.status(200).json(Response({statusCode:200,status:"ok",message:"driver is delivering the order ",data:drivertrackingByOrders}))
        }
        if(drivertrackingByOrder.assignedDrivertrack==="arrivedAtLocation"){
            const drivertrackingByOrders=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')

           return  res.status(200).json(Response({statusCode:200,status:"ok",message:"driver is reching the location ",data:drivertrackingByOrders}))
        }
        if(drivertrackingByOrder.assignedDrivertrack==="orderPicked"){
            const drivertrackingByOrders=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')

           return  res.status(200).json(Response({statusCode:200,status:"ok",message:"driver is reching the location ",data:drivertrackingByOrders}))
        }
        if(drivertrackingByOrder.assignedDrivertrack==="waytodeliver"){
            const drivertrackingByOrders=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')

           return  res.status(200).json(Response({statusCode:200,status:"ok",message:"driver is reching the location ",data:drivertrackingByOrders}))
        }
        if(drivertrackingByOrder.assignedDrivertrack==="orderDelivered"){
            const drivertrackingByOrders=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')

           return  res.status(200).json(Response({statusCode:200,status:"ok",message:"driver is reching the location ",data:drivertrackingByOrders}))
        }
        return  res.status(200).json(Response({statusCode:200,status:"ok",message:"please wait for driver   ",}))

        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))

    }
}

// tracking the driver from shoper end 
//-----------------##--------------

const shoperTrackingDriver=async(req,res,next)=>{
    try {
        // order ID
        const id=req.params.id
        
        const drivertrackingByOrder=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')
        console.log(drivertrackingByOrder)

        if(drivertrackingByOrder.assignedDrivertrack==="waytoPickup"){
            const drivertrackingByOrders=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')

           return  res.status(200).json(Response({statusCode:200,status:"ok",message:"driver is on the way to pickup the order ",data:drivertrackingByOrders}))
        }
        if(drivertrackingByOrder.assignedDrivertrack==="waytodeliver"){
            const drivertrackingByOrders=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')

           return  res.status(200).json(Response({statusCode:200,status:"ok",message:"driver is delivering the order ",data:drivertrackingByOrders}))
        }
        if(drivertrackingByOrder.assignedDrivertrack==="arrivedAtLocation"){
            const drivertrackingByOrders=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')

           return  res.status(200).json(Response({statusCode:200,status:"ok",message:"driver is reching the location ",data:drivertrackingByOrders}))
        }
        if(drivertrackingByOrder.assignedDrivertrack==="orderDelivered"){
            const drivertrackingByOrders=await Order.findById(id).populate('userId boutiqueId orderItems assignedDriver')

           return  res.status(200).json(Response({statusCode:200,status:"ok",message:"driver is reching the location ",data:drivertrackingByOrders}))
        }
        // return  res.status(200).json(Response({statusCode:200,status:"ok",message:"please wait for driver   ",}))

        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))

    }
}



module.exports={
    wayToPickupDriver,
    openTracker,
    orderPicked,
    onTheWayToDeliver,
    arrivedAtlocation,
    orderDelivered,
    openTrackerOfGet,
    boutiqueTrackingDriver,
    shoperTrackingDriver
}