const Response = require("../helpers/response");
const jwt = require("jsonwebtoken");
const TermsOfUse = require("../models/TurmsOfUse");

const caretTermsAdnControllerForAdmin=async (req,res, next)=>{
  
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
        if(!decoded._id==="admin"){
            return res.status(401).json(Response({ statusCode: 401, message: 'you are not admin.',status:'faield' }));
           }
      
    const {privacypolicyDroperDriver,otherPolicyDroperDriver}=req.body
    const makeDataForTermsAdncondition={
        userId:decoded._id,
        privacypolicyDroperDriver,
        otherPolicyDroperDriver
        
    }
    const createTuremsAndUse=await TermsOfUse.create(makeDataForTermsAdncondition)
    res.status(200).json(Response({statusCode:200,status:"ok",message:"terms and useses create successfully"}))

    } catch (error) {
     // Handle any errors
     return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));
    }
}
// for user terms and uses 
const privecyPolicy=async(req,res,next)=>{
    try {

        const privecyPolicyData=await TermsOfUse.find()
        res.status(200).json(Response({statusCode:200,status:"ok",message:"terms and useses create successfully",data:privecyPolicyData}))

        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));

    }
}

module.exports={
    caretTermsAdnControllerForAdmin,
    privecyPolicy
}