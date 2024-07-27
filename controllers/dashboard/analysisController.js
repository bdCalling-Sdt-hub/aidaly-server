const Response = require("../../helpers/response");
const Order = require("../../models/Order");
const Review = require("../../models/Reviews");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");


const getTotalOfTheDashboared=async(req,res)=>{
    try {
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
         
         // Verify the token
         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
         if(!decoded.role==="admin"){
            return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
           }

           const allTheBoutique=await User.find({role:"boutique"}).countDocuments()
           const allTheDriver=await User.find({role:"driver"}).countDocuments()
           const compliteOrder=await Order.find({status:"delivered"}).countDocuments()
           const totalData={
            allTheBoutique:allTheBoutique,
            allTheDriver:allTheDriver,
            compliteOrder:compliteOrder
           }
         
           res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product created successfully",data:{totalData} }));

        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}

const totalRevinew=async(req,res)=>{
    try {
        const {year}=req.query
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
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded.role==="admin"){
           return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
          }
        //   const revinew=await Order.find({status:"delivered"})
        const pipeline = [
            { $match: { status: 'delivered', createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) } } },
            { $group: { _id: null, grandTotal: { $sum: "$totalAmount" } } }
        ];

        const result = await Order.aggregate(pipeline);
        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product created successfully",data:result }));


        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}

// const feedbackRatio=async(req,res)=>{
//     try {
//         const {month}=req.query
//         // Get the token from the request headers
//         const tokenWithBearer = req.headers.authorization;
//         let token;
        
//         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//             // Extract the token without the 'Bearer ' prefix
//             token = tokenWithBearer.slice(7);
//         }
        
//         if (!token) {
//             return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
//         }
        
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         if(!decoded.role==="admin"){
//            return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
//           }

//           const reviewRatio=await Review

//     } catch (error) {
//         return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

//     }

// }
const feedbackRatio = async (req, res) => {
    try {
        const { month } = req.query;
        
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
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded || decoded.role !== "admin") {
            return res.status(401).json(Response({ statusCode: 401, message: 'You are not authorized as admin.', status: 'failed' }));
        }

        // Assuming Review is a model or access to reviews
        const reviews = await Review.find({ 
            // Adjust the query based on your schema
            createdAt: { 
                $gte: new Date(`${month}-01T00:00:00Z`), 
                $lte: new Date(`${month}-31T23:59:59Z`) 
            } 
        });

        // Calculate review ratio
        const totalReviews = reviews.length;
        let positiveReviews = 0;

        reviews.forEach(review => {
            // Your condition for considering a review as positive
            if (review.rating >= 4) {
                positiveReviews++;
            }
        });

        const ratio = totalReviews > 0 ? positiveReviews / totalReviews : 0;

        return res.status(200).json(Response({
            statusCode: 200,
            message: 'Review ratio calculated successfully.',
            data: {
                month,
                totalReviews,
                positiveReviews,
                ratio
            }
        }));
        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
    }
}


const todayorderDetailsinDashboared = async (req, res) => {
    try {
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
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded || decoded.role !== "admin") {
            return res.status(401).json(Response({ statusCode: 401, message: 'You are not authorized as admin.', status: 'failed' }));
        }
        
   
    // Get today's and yesterday's dates in UTC timezone
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    // Find orders created today
    const todayOrders = await Order.find({
        createdAt: {
            $gte: new Date(today + 'T00:00:00Z'), // Start of today
            $lte: new Date(today + 'T23:59:59Z') // End of today
        }
    });

    // Find orders created yesterday
    const yesterdayOrders = await Order.find({
        createdAt: {
            $gte: new Date(yesterdayDate + 'T00:00:00Z'), // Start of yesterday
            $lte: new Date(yesterdayDate + 'T23:59:59Z') // End of yesterday
        }
    });

     // Calculate the percentage change
     const todayCount = todayOrders.length;
     const yesterdayCount = yesterdayOrders.length;
     let percentageChange = 0;
     let changeType = 'No Change';

     if (yesterdayCount > 0) {
         percentageChange = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
         changeType = percentageChange >= 0 ? 'Positive' : 'Negative';
     } else if (todayCount > 0) {
         percentageChange = 100; // If there were no orders yesterday and there are orders today
         changeType = 'Positive';
     }

     // Round percentageChange to 2 decimal places
     percentageChange = parseFloat(percentageChange.toFixed(2));

     const data = {
         todayOrderCount: todayCount,
         yesterdayOrderCount: yesterdayCount,
         percentageChange: percentageChange, // Rounded to 2 decimal places
         changeType: changeType // Indicates if the change is positive or negative
     };
        return res.status(200).json({
            statusCode: 200,
            message: 'Today\'s orders fetched successfully.',
            data: data
        });
        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
    }
}

module.exports={
    getTotalOfTheDashboared,
    totalRevinew,
    feedbackRatio,
    todayorderDetailsinDashboared
}