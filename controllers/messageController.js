// const Response = require("../../helpers/response");

const Chat = require("../models/Chat");
const jwt = require("jsonwebtoken");
const Response = require("../helpers/response");
const Message = require("../models/Message");
//----------#-----------
// const createMessage=async(req,res)=>{
//     try {
//         // Get the token from the request headers
//         const tokenWithBearer = req.headers.authorization;
//         let token;
        
//         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//             // Extract the token without the 'Bearer ' prefix
//             token = tokenWithBearer.slice(7);
//         }
        
//         if (!token) {
//             return res.status(401).json({ statusCode: 401, message: 'Token is missing.', status: 'failed' });
//         }
        
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//         const {text,cahtId,receiverId}=req.body

//         const messageData={
//             chatId:cahtId,
//             senderId:decoded._id,
//             receiverId:receiverId,
//             text:text,
//             messageType:"text"

//         }
//         // const caheckUser=await Chat.findById(cahtId)
//         // // console.log(caheckUser.members[0].senderId.toString(), decoded._id)
//         // if(caheckUser.members[0].senderId.toString() !== decoded._id){

//         //  return res.status(404).json(Response({ statusCode: 404, message: 'you are not sender ', status: 'OK' }));
//         // }


//         const messages=await Message.create(messageData)

//         return res.status(200).json(Response({ statusCode: 200, message: 'create  message successfully', status: 'OK', data: messages }));

//     } catch (error) {
//         return res.status(500).json(Response({ status: 'failed', message: error.message, statusCode: 500 }));

        
//     }
// }

// // show the message
// const showMessages=async(req,res)=>{
//     try {
//         // Get the token from the request headers
//         const tokenWithBearer = req.headers.authorization;
//         let token;
        
//         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//             // Extract the token without the 'Bearer ' prefix
//             token = tokenWithBearer.slice(7);
//         }
        
//         if (!token) {
//             return res.status(401).json({ statusCode: 401, message: 'Token is missing.', status: 'failed' });
//         }
        
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         console.log(decoded._id

//         )
//         const {id}=req.query
//         const showTheMessage = await Message.find({
//             $or: [
//               { senderId: decoded._id, receiverId: id },
//               { senderId: id, receiverId: decoded._id }
//             ]
//           });
//         //   console.log(showTheMessage);
//         if(showTheMessage.length===0){
//             return res.status(404).json(Response({ statusCode: 404, message: `you don not have  message with `, status: 'OK' }));

//         }
//         return res.status(200).json(Response({ statusCode: 200, message: 'show  message successfully', status: 'OK', data: showTheMessage }));

//     } catch (error) {
//         return res.status(500).json(Response({ status: 'failed', message: error.message, statusCode: 500 }));

//     }
// }

// const messageWithImage=async(req,res)=>{
//     try {
//          // Get the token from the request headers
//          const tokenWithBearer = req.headers.authorization;
//          let token;
         
//          if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//              // Extract the token without the 'Bearer ' prefix
//              token = tokenWithBearer.slice(7);
//          }
         
//          if (!token) {
//              return res.status(401).json({ statusCode: 401, message: 'Token is missing.', status: 'failed' });
//          }
         
//          // Verify the token
//          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//          const {reciveId,chatId,}=req.body
//          const {messageImage}=req.files || {}
    
//     // const { messageImage } = req.files || {};
//     // for messageImage image 
// const files = [];

// // Check if there are uploaded files
// if (messageImage && Array.isArray(messageImage)) {
//     messageImage.forEach((img) => {
//         const publicFileUrl = `/images/users/${img.filename}`;
//         files.push({
//             publicFileUrl,
//             path: img.filename,
//         });
//     });
// }

//          const showTheMessage = await Message.find({
//              $or: [
//                { senderId: decoded._id, receiverId: reciveId },
//                { senderId: reciveId, receiverId: decoded._id }
//              ]
//            });
//          //   console.log(showTheMessage);
//          if(showTheMessage.length===0){
//              return res.status(404).json(Response({ statusCode: 404, message: `you don not have  message with `, status: 'OK' }));
 
//          }

//          const createMessage={
//             chatId:chatId,
//             senderId:decoded._id,
//             receiverId:reciveId,
//             image:files,
//             messageType:"file"
//          }
//   const message= await Message.create(createMessage)

//    return res.status(200).json(Response({ statusCode: 200, message: 'create   message successfully', status: 'OK', data: message }));
        
//     } catch (error) {

//    return res.status(500).json(Response({ status: 'failed', message: error.message, statusCode: 500 }));

        
//     }
// }

// module.exports={
//     createMessage,
//     showMessages,
//     messageWithImage
// }

const createMessage=async(req,res)=>{
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
        console.log(decoded)
        const {chatId,textMessage,reciverId}=req.body

        const data={
            chatId:chatId,
            senderId:decoded._id,
            reciverId:reciverId,
            textMessage:textMessage,
            messageType:"text"
            
        }

        const message=await Message.create(data)

        return res.status(200).json(Response({ statusCode: 200, message: 'message created successfully.', status: 'success', data: message })); 





        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error ' }));

        
    }
}

const showMessageOfUser=async(req,res)=>{
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
        const userId = decoded._id;
       // Fetch messages where the user is either the sender or receiver
       const messages = await Message.find({
        $or: [
            { senderId: userId },
            { reciverId: userId }
        ]
    }) // Optional: Sort messages by creation date in descending order

    if(messages.length===0){
        return res.status(401).json(Response({ statusCode: 401, message: 'you don not have message yet.', status: 'failed' }));

        
    }
    return res.status(200).json(Response({ statusCode: 200, message: 'message created successfully.', status: 'success', data: messages })); 

    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error ' }));

        
    }
}

const editMessage=async(req,res)=>{
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
        const userId = decoded._id;
        
        const {id,text}=req.body
        const message=await Message.findById(id)
        
        if(message.senderId.toString()===userId){

            const updateMessage=await Message.findByIdAndUpdate(id,{textMessage:text},{new:true})
            return res.status(200).json(Response({ statusCode: 200, message: 'message updated  successfully.', status: 'success', data: updateMessage })); 

        }else{
            return res.status(401).json(Response({ statusCode: 401, message: 'this is not your message.', status: 'failed' }));
        }
      


        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error ' }));

        
    }
}

const createMessageByImage=async(req,res)=>{
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
        const userId = decoded._id;

        const {chatId,reciverId}=req.body
        const {messageImage}= req.files;
        console.log(messageImage,"==-----------------")
        
const files = [];
if (req.files) {
    messageImage.forEach((messageImage) => {
    const publicFileUrl = `/images/users/${messageImage.filename}`;
    
    files.push({
      publicFileUrl,
      path: messageImage.filename,
    });
    // console.log(files);
  });
}

if(files.length===0){
    return res.status(401).json(Response({ statusCode: 401, message: 'plese uplode image', status: 'failed' }));


}

        const data={
            chatId:chatId,
            senderId:userId,
            reciverId:reciverId,
            messageImage:files[0],
            messageType:"image"

        }

        const createImageMessage=await Message.create(data)
        return res.status(200).json(Response({ statusCode: 200, message: 'image send successfully.', status: 'success', data: createImageMessage })); 


        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error ' }));

        
    }
}
module.exports={
    createMessage,
    showMessageOfUser,
    editMessage,
    createMessageByImage
}