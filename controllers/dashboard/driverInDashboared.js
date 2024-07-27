const pagination = require("../../helpers/pagination");
const Response = require("../../helpers/response");
const Driver = require("../../models/Driver");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");




const showAllDriverInDashboared=async(req,res)=>{
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
   
  const allDriver=await User.find({role:"driver"})
  .skip((page - 1) * limit)  // Pagination: skip previous pages
      .limit(limit)              // Limit the number of results per page
      .sort({ createdAt: -1 });  // Sort by creation date descending
      
      if(allDriver.length===0){
        return res.status(404).json(Response({ statusCode: 404, message: 'dont have any driver  .',status:'faield' }));


      }
      const paginationOfProduct= pagination(allDriver.length,limit,page)

  return res.status(200).json(Response({ statusCode: 200, message: "showed boutique product and ",data:allDriver,pagination:paginationOfProduct}));


    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}
const showDriverDetails=async(req,res)=>{
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
  const {id}=req.query
   
  const allDriver=await Driver.findOne({userId:id})
 


  return res.status(200).json(Response({ statusCode: 200, message: "showed boutique product and ",data:allDriver}));


    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}

module.exports={
    showAllDriverInDashboared,
    showDriverDetails
}