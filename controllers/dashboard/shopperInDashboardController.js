
const Response = require("../../helpers/response");

const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const pagination = require("../../helpers/pagination");
const Order = require("../../models/Order");


const blocakShopper = async (req, res) => {
    try {
      // Get the token from the request headers
      const tokenWithBearer = req.headers.authorization;
      let token;
  
      if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
      }
  
      if (!token) {
        return res.status(401).json({
          statusCode: 401,
          message: 'Token is missing.',
          status: 'failed'
        });
      }
  
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
      if (decoded.role !== 'admin') {
        return res.status(403).json({
          statusCode: 403,
          message: 'You are not an admin.',
          status: 'failed'
        });
      }
  
      // Get the user ID from query parameters
      const { id } = req.query;
      console.log(id)
  
      // Find the user by ID
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: 'User not found.',
          status: 'failed'
        });
      }
  
      // Check the current block status and toggle it
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { isBlocked: !user.isBlocked },
        { new: true }
      );
  
      const message = updatedUser.isBlocked ? 'Shopper blocked successfully' : 'Shopper unblocked successfully';
  
      return res.status(200).json(Response({
        statusCode: 200,
        message,
        data: updatedUser
      }));
  
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json(Response({
        statusCode: 500,
        message: error.message,
        status: 'server error'
      }));
    }
  };
  
  const getShoperByOrder=async(req,res)=>{
    try {
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
    return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
}

// Verify the token
const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
if(!decoded.role==="admin"){
   return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
  }
  const { date } = req.query;
    let query ={}

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999); // Set endDate to the end of the specified date

      // Add date filter to query
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
  const showuserByOrder=await Order.find(query).populate("userId boutiqueId")
  .skip((page - 1) * limit)  // Pagination: skip previous pages
      .limit(limit)              // Limit the number of results per page
      .sort({ createdAt: -1 });  // Sort by creation date descending
      
      if(showuserByOrder.length===0){
        return res.status(404).json(Response({ statusCode: 404, message: 'dont have any order .',status:'faield' }));


      }
      const paginationOfProduct= pagination(showuserByOrder.length,limit,page)

          return res.status(200).json(Response({ statusCode: 200, message: "showed shopper succesfully",data:showuserByOrder,pagination:paginationOfProduct}));


        
    } catch (error) {
        return res.status(500).json(Response({
            statusCode: 500,
            message: error.message,
            status: 'server error'
          }));
        
    }
  }

  
module.exports={
   
    blocakShopper,
    getShoperByOrder
}