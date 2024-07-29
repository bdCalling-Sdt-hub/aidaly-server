const Response = require("../../helpers/response");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const pagination = require("../../helpers/pagination");
const Product = require("../../models/Product");
const Feedback = require("../../models/Feedback");

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

const sendFeedback=async(req,res)=>{
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

  const {title,description,boutiqueId}=req.body
  const { feedBackImage } = req.files;


   
  const files = [];
  if (req.files) {
    feedBackImage.forEach((feedBackImage) => {
      const publicFileUrl = `/images/users/${feedBackImage.filename}`;
      
      files.push({
        publicFileUrl,
        path: feedBackImage.filename,
      });
      // console.log(files);
    });
  }
  const data={
    title:title,
    boutiqueId:boutiqueId,
    feedbackDescription:description,
    feedBackImage:files[0]
  }
  const doFeedBack=await Feedback.create(data)
  return res.status(200).json(Response({ statusCode: 200, message: "feedback create succesfully ",data:doFeedBack}));

        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

        
    }
}
const updateProfileOfboutiqueInDashboared=async(req,res,next)=>{
    const {name,email,phone,address,rate, city,state,description,id}=req.body

    const { image } = req.files || {};
const files = [];

// Check if there are uploaded files
if (image && Array.isArray(image)) {
    image.forEach((img) => {
        const publicFileUrl = `/images/users/${img.filename}`;
        files.push({
            publicFileUrl,
            path: img.filename,
        });
    });
}
   

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
        if(!decoded.role==="admin"){
            return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
           }
           
       const user=await User.findById(id)
       
        // Assuming you have some user data in req.body that needs to be updated
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone=phone ||user.phone;
        user.address=address|| user.address;
        user.city=city|| user.city;
        user.state=state ||user.state
        user.image=files[0]|| user.image;
        user.rate=rate|| user.rate
        user.description=description || user.description
        

        // Save the updated user profile
       const users= await user.save();

        // Respond with success message
        res.status(200).json(Response({ statusCode: 200, message: 'Profile updated successfully.', status: 'success',data:users}));

    }catch(error){
        res.status(500).json(Response({ statusCode: 500, message: error.message,status:'Failed' }));
    }


}

const addBoutique=async(req,res)=>{
    try {
        const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!decoded.role==="admin"){
        return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
       }

       const { name, email, password, address, rate,phone,  city, state, description } = req.body;
       console.log(description )
     
       const {image} = req.files;
     const files = [];
     if (req.files) {
         image.forEach((image) => {
         const publicFileUrl = `/images/users/${image.filename}`;
         
         files.push({
           publicFileUrl,
           path: image.filename,
         });
         // console.log(files);
       });
     }
console.log(image,files)

       // Validate request body
       if (!name) {
           return res.status(400).json(Response({statusCode:400,status:"name required", message: "Name is required" }));
       }

       if (!email) {
           return res.status(400).json(Response({status:"email ",statusCode:400, message: "Email is required" }));
       }

       if (!password) {
           return res.status(400).json(Response({status:"password faild",statusCode:400, message: "Password is required" }));
       }

       const user = await User.findOne({ email });
       if (user) {
           return res.status(400).json(Response({ status:"faild",statusCode:400, message: "User already exists" }));
       }

       const userDetails = {
           name,
           email,
           password,
           image,
           phone,
           rate,
           city,
           state,
           address,
           role: "boutique",
           description
       };
 // Check if image is provided in the request
 if (files && files.length > 0) {
   userDetails.image = files[0];
 }

  const boutique= await User.create(userDetails)

    // Respond with success message
    res.status(200).json(Response({ statusCode: 200, message: 'Profile create   successfully.', status: 'success',data:boutique}));

        

        
    } catch (error) {
        res.status(500).json(Response({ statusCode: 500, message: error.message,status:'Failed' }));

        
    }
}
module.exports={
    getAllBoutiqueForAdmin,
    boutiqueDetails,
    sendFeedback,
    updateProfileOfboutiqueInDashboared,
    addBoutique

}