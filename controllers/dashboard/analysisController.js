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

// const totalRevinew=async(req,res)=>{
//     try {
//         const {year}=req.query
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
//         //   const revinew=await Order.find({status:"delivered"})
//         const pipeline = [
//             { $match: { status: 'delivered', createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) } } },
//             { $group: { _id: null, grandTotal: { $sum: "$totalAmount" } } }
//         ];

//         const result = await Order.aggregate(pipeline);
//         res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product created successfully",data:result }));


        
//     } catch (error) {
//         return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
//     }
// }
const totalRevinew = async (req, res) => {
    try {
        const { year } = req.query;
        
        // Ensure the year parameter is provided and valid
        if (!year || isNaN(year)) {
            return res.status(400).json(Response({ statusCode: 400, message: 'Invalid year provided.', status: 'failed' }));
        }

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
        if (decoded.role !== "admin") {
            return res.status(401).json(Response({ statusCode: 401, message: 'You are not authorized as admin.', status: 'failed' }));
        }

        // Get the start and end date for the specified year
        const startDate = new Date(`${year}-01-01T00:00:00Z`);
        const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`);

        // Ensure the dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json(Response({ statusCode: 400, message: 'Invalid date range.', status: 'failed' }));
        }

        // Fetch orders for the specified year
        const orders = await Order.find({
            status: 'delivered',
            createdAt: { $gte: startDate, $lt: endDate }
        });

        // Calculate total revenue and monthly breakdown
        let totalRevenue = 0;
        const monthlyRevenue = Array(12).fill(0); // Array to store revenue for each month

        orders.forEach(order => {
            const amount = parseFloat(order.totalAmount);
            if (!isNaN(amount)) {
                totalRevenue += amount;

                const month = order.createdAt.getMonth(); // 0-based month index
                monthlyRevenue[month] += amount;
            }
        });

        // Month names array
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Create a response object with total revenue and monthly breakdown
        const response = {
            totalRevenue: totalRevenue.toFixed(2),
            monthlyRevenue: monthlyRevenue.map((revenue, index) => ({
                month: monthNames[index],
                revenue: revenue.toFixed(2)
            }))
        };

        return res.status(200).json(Response({
            statusCode: 200,
            status: "ok",
            message: "Revenue data fetched successfully",
            data: response
        }));

    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
    }
};



const feedbackRatio = async (req, res) => {
    try {
        const { year } = req.query;

        if (!year || isNaN(parseInt(year))) {
            return res.status(400).json(Response({ statusCode: 400, message: 'A valid year is required.', status: 'failed' }));
        }

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

        // Define start and end of the year
        const startDate = new Date(`${year}-01-01T00:00:00Z`);
        const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00Z`); // The start of the next year
        endDate.setMilliseconds(endDate.getMilliseconds() - 1); // End of the year

        // Fetch reviews for the specified year
        const reviews = await Review.find({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        // Calculate review ratio
        const totalReviews = reviews.length;
        let positiveReviews = 0;

        reviews.forEach(review => {
            // Convert rating to number for comparison
            const rating = parseInt(review.rating, 10);
            if (rating >= 4) {
                positiveReviews++;
            }
        });

        const ratio = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0; // Convert to percentage

        return res.status(200).json(Response({
            statusCode: 200,
            message: 'Review ratio calculated successfully.',
            data: {
                year,
                totalReviews,
                positiveReviews,
                ratio: parseInt(ratio) // Rounded to 2 decimal places
            }
        }));

    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
    }
};



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
        return res.status(200).json(Response({
            statusCode: 200,
            message: 'Today\'s orders fetched successfully.',
            data: data
        }));
        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
    }
}

// const totalCostAndSell=async(req,res)=>{
//     try {
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
//         if (!decoded || decoded.role !== "admin") {
//             return res.status(401).json(Response({ statusCode: 401, message: 'You are not authorized as admin.', status: 'failed' }));
//         }    


//         const totalSell=await Order.find({status:"delivered"})

//         return res.status(200).json(Response({
//             statusCode: 200,
//             message: 'total showed succesfully',
//             data: totalSell
//         }));
        
//     } catch (error) {
//         return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));

        
//     }
// }
const totalCostAndSell = async (req, res) => {
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

        // Calculate the date range for the past 7 days
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Find orders from the past 7 days
        const orders = await Order.find({
            createdAt: {
                $gte: sevenDaysAgo, // Start date (7 days ago)
                $lte: today         // End date (today)
            },
            status: "delivered" // Filter for delivered orders
        });

        // Calculate the total amount
        const totalAmount = orders.reduce((total, order) => {
            return total + parseFloat(order.totalAmount); // Assuming totalAmount is a string that needs to be converted to a number
        }, 0);

        return res.status(200).json(Response({
            statusCode: 200,
            message: 'Total cost and sell data fetched successfully.',
            data: {
                totalAmount: totalAmount.toFixed(2) // Round to 2 decimal places
            }
        }));
        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
    }
};


module.exports={
    getTotalOfTheDashboared,
    totalRevinew,
    feedbackRatio,
    todayorderDetailsinDashboared,
    totalCostAndSell
}