const Response = require("../../helpers/response");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const pagination = require("../../helpers/pagination");
const Product = require("../../models/Product");

const  getAllBoutiqueForAdmin=async(req,res)=>{
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

      

    // if (date) {
    //   const startDate = new Date(date);
    //   const endDate = new Date(date);
    //   endDate.setHours(23, 59, 59, 999); // Set endDate to the end of the specified date

    //   // Add date filter to query
    //   query.createdAt = { $gte: startDate, $lte: endDate };
    // }

      // Initialize query object
      let query = {};

      // Check if month and year are provided for filtering
      const { month, year } = req.query;
  
      if (month && year) {
        const startDate = new Date(year, month - 1, 1); // Start of the given month
        const endDate = new Date(year, month, 0); // End of the given month
        endDate.setHours(23, 59, 59, 999); // Set endDate to the end of the given month
  
        // Add date filter to query
        query.createdAt = { $gte: startDate, $lte: endDate };
      }
    // Find all shoppers with optional date filter
    const allboutique = await User.find(query)
      .skip((page - 1) * limit)  // Pagination: skip previous pages
      .limit(limit)              // Limit the number of results per page
      .sort({ createdAt: -1 });  // Sort by creation date descending
      
      if(allboutique.length===0){
        return res.status(404).json(Response({ statusCode: 404, message: 'dont have boutique .',status:'faield' }));


      }

      const paginationOfProduct= pagination(allboutique.length,limit,page)

          return res.status(200).json(Response({ statusCode: 200, message: "showed shopper succesfully",data:allboutique,pagination:paginationOfProduct}));


        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}

const boutiqueDetails=async(req,res)=>{
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
          
           const {id}=req.query
            
           const userDetails=await User.findById(id)

           const productforBoutique=await Product.find({userId:id})
           const data={
            userDetails:userDetails,
            product:productforBoutique
           }
           return res.status(200).json(Response({ statusCode: 200, message: "showed boutique product and ",data:data,}));

        
    } catch (error) {

        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}

module.exports={
    getAllBoutiqueForAdmin,
    boutiqueDetails

}