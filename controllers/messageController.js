const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Response = require('../helpers/response');


const createMessage=async(req,res,next)=>{

    
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

       const {text,file,messageType}=req.body
       console.log(req.body)
       const getAllmessage={UserId:decoded._id,text,file,messageType}
       console.log(getAllmessage)
     
        const makeMessage=await Message.create(getAllmessage)
        console.log(makeMessage)


        res.status(200).json(Response({
            message: "message  created succesfully",
            status:"success",
            statusCode:200,
            // data: makeMessage,
            
        }));
    
        
    } catch (error) {

      // Handle any errors
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:'server error' }));
    }
}



module.exports={
    createMessage
}