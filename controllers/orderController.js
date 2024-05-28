const Response = require("../helpers/response")
const Order = require("../models/Order")
const jwt = require("jsonwebtoken");
const OrderItem = require("../models/OrderItem");
const User = require("../models/User");
const Location = require("../models/Location");
const pagination = require("../helpers/pagination");
const Product = require("../models/Product");


// pay order controller 
// const makeOreder=async(req,res,next)=>{
//     const {items,
//         totalAmount,
//         status,
//         deliveryAddress,
//         paymentMethod,serviceFee,
//         paymentStatus,
//         tips,
//         shippingFee,
//         tax,
//         boutiqueId}=req.body
// console.log(boutiqueId,"this boutique id")
//    // Get the token from the request headers
//    const tokenWithBearer = req.headers.authorization;
//    let token;

//    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//        // Extract the token without the 'Bearer ' prefix
//        token = tokenWithBearer.slice(7);
//    }

//    if (!token) {
//        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
//    }

//    try {
//        // Verify the token
//        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//        function generateOrderCode() {
//         const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
//         let code = '#';
        
//         for (let i = 0; i < 6; i++) {
//             const randomIndex = Math.floor(Math.random() * characters.length);
//             code += characters[randomIndex];
//         }
    
//         return code;
//     }
//       // Example usage:
//     const orderCode = generateOrderCode();
   
//     // product ordered 
//        const creteProductOrder=await OrderItem.create({orederedProduct:items,orderId:orderCode})
    
//     //    const orderItemsId=await OrderItem.findOne({orderId:orderCode})
//     //    const itemsOrdered=await OrderItem.findById(orderItemsId)
//     //   const products= itemsOrdered.orederedProduct.map(async(product)=>{
//     //     const updateProductQuentity=await Product.findByIdAndUpdate(product.productId,{inventoryQuantity:inventoryQuantity.parseInt()-product.quantity})
//     //        console.log(updateProductQuentity, product,"this update quentity ")
//     //    })
//     //    console.log(products,"product after order ")
   
//     const orderItemsId = await OrderItem.findOne({ orderId: orderCode }); // Assuming orderItem holds the document
//     if (!orderItemsId) {
//         console.log("Order item not found");
//         return; // or handle the error
//     }
    
//     const itemsOrdered = await OrderItem.findById(orderItemsId._id); // Using _id to get the specific item
//     if (!itemsOrdered) {
//         console.log("Items ordered not found");
//         return; // or handle the error
//     }
    
//     const promises = itemsOrdered.orederedProduct.map(async (product) => {
//         const existingProduct = await Product.findById(product.productId);
//         if (!existingProduct) {
//             console.log(`Product with ID ${product.productId} not found`);
//             return; // or handle the error
//         }
        
//         // Parse inventoryQuantity to integer before subtraction
//         const updatedQuantity = parseInt(existingProduct.inventoryQuantity) - parseInt(product.quantity);
//         console.log(updatedQuantity,"this my product countity")
//     // Check if updated quantity is less than or equal to 0
//     if (updatedQuantity <= 0) {
//         throw new Error(`Cannot order product because the quantity for product ${existingProduct._id} is not available.`);
//     }
//         // Update the product in the database
//         const updatedProduct = await Product.findByIdAndUpdate(
//             product.productId,
//             { 'inventoryQuantity': updatedQuantity.toString() }, // Convert back to string before updating
//             { new: true } // To return the updated document
//         );
//         console.log(updatedProduct, product, "updated quantity");
//         return updatedProduct; // Returning the updated product
//     });
    
//     try {
//         const updatedProducts = await Promise.all(promises);
//         console.log(updatedProducts, "products after order");
//     } catch (error) {
//         console.error("Error updating products:", error);
//     }
    
//        const orderedProperty={
//         userId:decoded._id,
        
//         totalAmount,
//         status,
//         deliveryAddress,
//         paymentMethod,
//         paymentStatus,
//         tips,
//         shippingFee,
//         orderId:orderCode,
//         serviceFee,
//         orderItems:orderItemsId,
//         tax,
//         boutiqueId


//        }
//         const createOrder=await Order.create(orderedProperty)
       

//         res.status(200).json(Response({status:"success", message:"ordered successfully", data:createOrder,statusCode:200}))
        
//     } catch (error) {
//         // server error
//         res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
        
//     }
// }

const makeOreder = async (req, res, next) => {
    const {
        items,
        totalAmount,
        status,
        deliveryAddress,
        paymentMethod,
        serviceFee,
        paymentStatus,
        tips,
        shippingFee,
        tax,
        boutiqueId,
        subTotal
    } = req.body;
    console.log(boutiqueId, "this boutique id");

    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({
            statusCode: 401,
            message: 'Token is missing.',
            status: 'failed'
        }));
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
        const creteProductOrder = await OrderItem.create({
            orederedProduct: items,
            orderId: orderCode
        });

        const orderItemsId = await OrderItem.findOne({
            orderId: orderCode
        }); // Assuming orderItem holds the document
        if (!orderItemsId) {
            console.log("Order item not found");
            return; // or handle the error
        }

        const itemsOrdered = await OrderItem.findById(orderItemsId._id); // Using _id to get the specific item
        if (!itemsOrdered) {
            console.log("Items ordered not found");
            return; // or handle the error
        }

        // Flag to track if any invalid product quantities were found
        let invalidQuantitiesFound = false;

        const promises = itemsOrdered.orederedProduct.map(async (product) => {
            const existingProduct = await Product.findById(product.productId);
            if (!existingProduct) {
                console.log(`Product with ID ${product.productId} not found`);
                return; // or handle the error
            }

            // Parse inventoryQuantity to integer before subtraction
            const updatedQuantity = parseInt(existingProduct.inventoryQuantity) - parseInt(product.quantity);
            console.log(updatedQuantity, "this my product countity");

            // Check if updated quantity is less than or equal to 0
            if (updatedQuantity < 0) {
                invalidQuantitiesFound = true;
                console.error(`Cannot order product because the quantity for product ${existingProduct._id} is not available.`);
                return; // Skip updating this product
            }

            // Update the product in the database
            const updatedProduct = await Product.findByIdAndUpdate(
                product.productId, {
                    'inventoryQuantity': updatedQuantity.toString()
                }, // Convert back to string before updating
                {
                    new: true
                } // To return the updated document
            );
            console.log(updatedProduct, product, "updated quantity");
            return updatedProduct; // Returning the updated product
        });

        // Wait for all promises to resolve
        const updatedProducts = await Promise.all(promises);
        console.log(updatedProducts, "products after order");

        // If any invalid quantities were found, send a 401 response
        if (invalidQuantitiesFound) {
            return res.status(401).json(Response({
                statusCode: 401,
                message: "Cannot order products because some quantities are not available.",
                status: 'failed'
            }));
        }

        // Create order only if all product quantities are valid
        const allQuantitiesValid = updatedProducts.every(product => product && product.inventoryQuantity >= 0);
        console.log(allQuantitiesValid,"jsdlkjflksdfjlkdjldksfjdslkfjdsklf")
        if (!allQuantitiesValid) {
            console.error("Order not created: Some product quantities are invalid");
            return res.status(400).json(Response({
                status: "failed",
                message: "Some product quantities are invalid",
                statusCode: 400
            }));
        }

        // If all quantities are valid, continue to create the order
        const orderedProperty = {
            userId: decoded._id,
            totalAmount,
            status,
            deliveryAddress,
            paymentMethod,
            paymentStatus,
            tips,
            shippingFee,
            orderId: orderCode,
            serviceFee,
            orderItems: orderItemsId,
            tax,
            boutiqueId,
            subTotal
        };
     
        const createOrder = await Order.create(orderedProperty);
        console.log(createOrder,"this order ")
        res.status(200).json(Response({
            status: "success",
            message: "Ordered successfully",
            data: createOrder,
            statusCode: 200
        }));
    } catch (error) {
        // server error
        res.status(500).json(Response({
            status: "failed",
            message: error.message,
            statusCode: 500
        }));
    }
};


const newOrder=async(req,res,next)=>{
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
       if(!decoded._id==="boutique"){
        return res.status(401).json(Response({ statusCode: 401, message: 'you are not boutique.',status:'faield' }));
       }

        const totalNewOrderLength=await Order.find({status:"neworder"}).countDocuments()
        if(totalNewOrderLength===0){
            return res.status(400).json(Response({ statusCode: 401, message: 'you dont have any new order product.',status:'faield' }));
        }
     
        const totalNewOrder=await Order.find({status:"neworder"}).populate("orderItems")
        .skip((page - 1) * limit)
        .limit(limit);
         // call the pagination

         const paginationOfProduct= pagination(totalNewOrderLength,limit,page)
         res.status(200).json(Response({
             message: "order showed succesfully",
             status:"success",
             statusCode:200,
             data: totalNewOrder,
             pagination: paginationOfProduct
         }));
        
     } catch (error) {

        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
     }
}
const orderInprogresShow=async(req,res,next)=>{
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
       if(!decoded._id==="boutique"){
        return res.status(401).json(Response({ statusCode: 401, message: 'you are not boutique.',status:'faield' }));
       }

        const totalinProgressOrderLength=await Order.find({status:"inprogress"}).countDocuments()
     
        const totainprogressOrder=await Order.find({status:"inprogress"}).populate("orderItems")
        .skip((page - 1) * limit)
        .limit(limit);
         // call the pagination

         const paginationOfProduct= pagination(totalinProgressOrderLength,limit,page)
         res.status(200).json(Response({
             message: "order showed succesfully",
             status:"success",
             statusCode:200,
             data: totainprogressOrder,
             pagination: paginationOfProduct
         }));
        
     } catch (error) {

        // server error
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
     }
}

// update the order statuse new order to in-progress
const orderInProgress=async(req,res,next)=>{
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
       if(!decoded._id==="boutique"){
        return res.status(401).json(Response({ statusCode: 401, message: 'you are not boutique.',status:'faield' }));
       }
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
    const driverId = req.query.driverId;

    
    try { 
         
        
   // Update the order with the assigned driver
   const driverAssigned = await Order.findByIdAndUpdate(id, { assignedDriver: driverId, status:"assigned" }, { new: true });
   await User.findByIdAndUpdate(driverId,{assignedDriverProgress:"newOrder"},{new:true})
   res.status(200).json(Response({ status: "success", statusCode: 200, message: "Updated for assigned driver", data: driverAssigned }));

    } catch (error) {
        // Server error
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
    }
};

// update statuse for assigned driver 
const findNearByDriver = async (req, res, next) => {
    const id = req.params.id;
    // const boutique = req.query.boutiqueId;

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
       if(!decoded._id==="boutique"){
        return res.status(401).json(Response({ statusCode: 401, message: 'you are not boutique.',status:'faield' }));
       }
        // Boutique location 
        const boutiqueLocation = await User.findById(decoded._id);
        console.log(boutiqueLocation.currentLocation);
   
        const allDrivers = await User.find({ role: 'driver',status:"active" }).populate()
        const drivers = allDrivers.map(driver => driver.currentLocation);
    console.log(allDrivers,"all driverSS")

        // Calculate distances and filter drivers within one kilometer
        const nearbyDrivers = drivers.filter(driver => {
            const distance = calculateDistance(boutiqueLocation.currentLocation, driver);
            console.log(distance < 10);
            return distance < 1.5; // Filter drivers within one kilometer
        });
        
        
        // const userIds = nearbyDrivers.map(item => item.userId);
        // const users = await User.find({ _id: { $in: userIds } });


        if (nearbyDrivers.length > 0) {
            // Update the order with the assigned driver
            // const driverAssigned = await Order.findByIdAndUpdate(id, { assignedDriver: }, { new: true });
            res.status(200).json(Response({ status: "success", statusCode: 200, message: "Updated for assigned driver", data: allDrivers }));
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
   


    const allOrderedProductOfBoutique = await Order.find({boutiqueId:decoded._id});
    const statuseOfDashBoard=allOrderedProductOfBoutique.map(order=>order.status)
    console.log(statuseOfDashBoard)

// const activeOrders=await Order.find({boutiqueId:decoded._id},{status:"neworder"})
const activeOrders = await Order.find({ boutiqueId: decoded._id, status: "neworder" });

let totalAmount = 0;

activeOrders.forEach(order => {
    totalAmount += parseFloat(order.totalAmount.replace(/[^\d.]/g, ''));

});

console.log("Total amount of new orders:", totalAmount);
//

// console.log(activeOrders)
    
   if(allOrderedProductOfBoutique.length===0){
    res.status(200).json(Response({statusCode:200,status:"ok",message:"your product havent ordered yet ", }))
   }

        res.status(200).json(Response({statusCode:200,status:"ok",message:"fetch alldeta ",data:allOrderedProductOfBoutique}))
    } catch (error) {
         // server error
         res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}

const inprogresOrderDetails=async (req,res,next)=>{
    const id=req.params.id
    try {
        const progressDetails=await Order.findById(id).populate("orderItems boutiqueId")

        res.status(200).json(Response({statusCode:200,status:"ok",message:"fetch details of inprogress order ",data:progressDetails}))


        
    } catch (error) {
    // server error
    res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
}
}

const assignedOrderedShowe=async (req,res,next)=>{

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
      if(!decoded._id==="boutique"){
       return res.status(401).json(Response({ statusCode: 401, message: 'you are not boutique.',status:'faield' }));
      }

       const totalinProgressOrderLength=await Order.find({status:"assigned"}).countDocuments()
    
       const totainprogressOrder=await Order.find({status:"assigned"}).populate("orderItems assignedDriver")
       .skip((page - 1) * limit)
       .limit(limit);
        // call the pagination

        const paginationOfProduct= pagination(totalinProgressOrderLength,limit,page)
        res.status(200).json(Response({
            message: "order showed succesfully",
            status:"success",
            statusCode:200,
            data: totainprogressOrder,
            pagination: paginationOfProduct
        }));
       

        
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
    assignedDriver,
    newOrder,
    orderInprogresShow,
    inprogresOrderDetails,
    assignedOrderedShowe,
    findNearByDriver
}