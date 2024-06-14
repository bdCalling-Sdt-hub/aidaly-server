const Response = require('../helpers/response');
const Chat = require('../models/Chat');
const jwt = require("jsonwebtoken");
const Message = require('../models/Message');
const mongoose = require('mongoose');

// Ensure you have imported the ObjectId type from mongoose
const { ObjectId } = mongoose.Types;
// Controller function to create a new chat
// const createChat = async (req, res) => {
  
//      // Get the token from the request headers
//      const tokenWithBearer = req.headers.authorization;
//      let token;
 
//      if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//          // Extract the token without the 'Bearer ' prefix
//          token = tokenWithBearer.slice(7);
//      }
 
//      if (!token) {
//          return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
//      }
 
//      try {
//          // Verify the token
//          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
 
//         const { participants, messages } = req.body;
//         const particepanetId={participants, id:decoded._id}
//         const chat = new Chat({ particepanetId, messages });
//         await chat.save();
//         return  res.status(200).json(Response({statusCode:200,status:"ok",message:"chate is create    "}))
//     } catch (error) {
//         res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
//     }
// };
// const createChat = async (req, res) => {
//     // Get the token from the request headers
//     const tokenWithBearer = req.headers.authorization;
//     let token;

//     if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//         // Extract the token without the 'Bearer ' prefix
//         token = tokenWithBearer.slice(7);
//     }

//     if (!token) {
//         return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//         // Extract user ID from decoded token
//         const userId = decoded._id;
//         console.log(userId)

//         // Retrieve participants and messages from request body
//         const { participants, messages } = req.body;

//         // Add the user's ID to the participants array
//         participants.push( {pid: userId} );

//         // Create a new chat document
//         const chat = new Chat({ participants, messages });

//         // Save the chat document
//         await chat.save();

//         // Respond with success message
//         return res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Chat is created." }));
//     } catch (error) {
//         // Respond with error message if an error occurs
//         res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
//     }
// };
// const createChat = async (req, res) => {
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

//         // Extract user ID from decoded token
//         const userId = decoded._id;

//         // Retrieve participants and messages from request body
//         const { participants, messages } = req.body;

//         // Add the user's ID to the participants array
//         participants.forEach(participant => {
//             participant.pid = userId;
//         });

//         // Create a new chat document
//         const chat = new Chat({ participants, messages });

//         // Save the chat document
//         await chat.save();

//         // Respond with success message
//         return res.status(200).json({ statusCode: 200, status: "ok", message: "Chat is created.", data: chat });
//     } catch (error) {
//         // Respond with error message if an error occurs
//         return res.status(500).json({ status: "failed", message: error.message, statusCode: 500 });
//     }
// };
// const createChat = async (req, res) => {
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

//         // Extract user ID from decoded token
//         const userId = decoded._id;

//         // Retrieve participants and messages from request body
//         const { pid,id } = req.body;

       

//     const messages= await Message.findById(id)
//     console.log(messages)
//     const chat = new Chat({ pid: pid, sid: userId, messages:[{sid:messages._id} ]});
   
//         await chat.save();

//         // Respond with success message
//         return res.status(200).json({ statusCode: 200, status: "ok", message: "Chat is created.", data: chat });}
//      catch (error) {
//         // Respond with error message if an error occurs
//         return res.status(500).json({ status: "failed", message: error.message, statusCode: 500 });
//     }
// };
const createChat = async (req, res) => {
    try {
        // Get the token from the request headers
        const tokenWithBearer = req.headers.authorization;
        let token;

        if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
            // Extract the token without the 'Bearer ' prefix
            token = tokenWithBearer.slice(7);
        }

        if (!token) {
            return res.status(401).json({ statusCode: 401, message: 'Token is missing.', status: 'failed' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Extract user ID from decoded token
        const userId = decoded._id;

        // Retrieve participants and messages from request body
        const { pid, id } = req.body;

        // Check if there's an existing chat involving both participants
        // let existingChat = await Chat.findOne({ pid: pid, sid: userId });
        //   existingChat= await Chat.findOne({ pid: userId, sid: pid });
        // console.log(existingChat,"sdljflsdjflkdsjflksdjfl",userId,existingChat2)
// Check if there's an existing chat involving both participants
let existingChat = await Chat.findOne({ $or: [{ pid: pid, sid: userId }, { pid: userId, sid: pid }] });

        // if (!existingChat) {
        //     // If no chat found, check with roles reversed
        //     existingChat = await Chat.findOne({ pid: userId, sid: pid });
        //     console.log(existingChat,"this is ex")
        // }
// console.log(existingChat._id,"dksjflksdjffjgs")
// Convert the id string to an ObjectId
const objectId = new ObjectId(id);
        if (existingChat) {
            // If a chat already exists, update its messages array with the new message
           const data= await Chat.findByIdAndUpdate(existingChat._id,{ $push: { messages: {sid:objectId} }});
        //    console.log(data.messages.length-1)

            // Respond with success message
            return res.status(200).json({ statusCode: 200, status: "ok", message: "Message added to existing chat.", data: data });
        }

        // If no existing chat, create a new one
        const messages = await Message.findById(id);
        console.log(messages,"this is messgaer")
        
        const chat = await Chat.create({ pid: pid, sid: userId, messages: [messages] });

        

        // Respond with success message
        return res.status(200).json({ statusCode: 200, status: "ok", message: "New chat created.", data:chat });
    }catch (error) {
        // Respond with error message if an error occurs
        return res.status(500).json({ status: "failed", message: error.message, statusCode: 500 });
    }
};


// const createChat = async (req, res) => {
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

//         // Extract user ID from decoded token
//         const userId = decoded._id;

//         // Retrieve sender ID and messages from request body
//         const { sid, messages } = req.body;

//         // Find messages sent by the current user
//         const userMessages = await Message.find({ UserId: userId });

//         // Determine whether the current user is the sender or receiver
//         const isSender = sid === userId;

//         // Create an array to store updated messages
//         const updatedMessages = [];

//         // Loop through the messages
//         for (const message of messages) {
//             // Determine the participant ID (pid) and sender ID (sid)
//             const pid = isSender ? userId : sid;
//             const currentSid = isSender ? sid : userId;

//             // Find the message ID for the sender
//             const messageExists = userMessages.find(msg => msg._id === message);

//             // If the current user is the sender and the message exists, update the sid
//             // Otherwise, set the sid to the sender ID
//             const updatedSid = isSender && messageExists ? currentSid : sid;

//             // Add the updated message to the array
//             updatedMessages.push({ pid, sid: updatedSid, message });
//         }

//         // Find an existing chat document
//         const existingChat = await Chat.findOne({ pid: userId, sid });

//         if (existingChat) {
//             // Concatenate the existing messages with the updated messages
//             existingChat.messages = [...existingChat.messages, ...updatedMessages];
//             await existingChat.save();
//             return res.status(200).json({ statusCode: 200, status: "ok", message: "Chat is updated.", data: existingChat });
//         } else {
//             // Create a new chat document
//             const chat = new Chat({ pid: userId, sid, messages: updatedMessages });
//             await chat.save();
//             return res.status(200).json({ statusCode: 200, status: "ok", message: "Chat is created.", data: chat });
//         }
//     } catch (error) {
//         // Respond with error message if an error occurs
//         return res.status(500).json({ status: "failed", message: error.message, statusCode: 500 });
//     }
// };


// Controller function to retrieve all chats
const getAllChats = async (req, res) => {
    try {
         // Get the token from the request headers
         const tokenWithBearer = req.headers.authorization;
         let token;
 
         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
             // Extract the token without the 'Bearer ' prefix
             token = tokenWithBearer.slice(7);
         }
 
         if (!token) {
             return res.status(401).json({ statusCode: 401, message: 'Token is missing.', status: 'failed' });
         }
 
         // Verify the token
         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
 
        // const chats = await Chat.find({sid:decoded._id}).populate("pid")
  
        // const lastMessages = chats.map(async(chat) => {
        //     const lastMessage = chat.messages[chat.messages.length - 1]; // Extract the last message from the array
        //     const message=await Message.find({_id:lastMessage.sid})
        //     console.log(message)

        //     return message;
        // });
        const chats = await Chat.find({ sid: decoded._id }).populate("pid");

const lastMessages = await Promise.all(chats.map(async (chat) => {
    const lastMessage = chat.messages[chat.messages.length - 1]; // Extract the last message from the array
    const message = await Message.findById(lastMessage._id).populate("sid"); // Populate the sender information
    
    // Merge the last message into the chat object
    return Object.assign({}, chat.toObject(), { lastMessage });
}));

console.log(lastMessages);

        console.log( lastMessages)
            return res.status(200).json({ statusCode: 200, status: "ok", message: "Chat is showing .", data: lastMessages});
} catch (error) {
        return res.status(500).json({ status: "failed", message: error.message, statusCode: 500 });
}
};

// Controller function to retrieve a specific chat by ID
const getChatById = async (req, res) => {
    try {
         // Get the token from the request headers
         const tokenWithBearer = req.headers.authorization;
         let token;
 
         if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
             // Extract the token without the 'Bearer ' prefix
             token = tokenWithBearer.slice(7);
         }
 
         if (!token) {
             return res.status(401).json({ statusCode: 401, message: 'Token is missing.', status: 'failed' });
         }
 
         // Verify the token
         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
 
        const chat = await Chat.findById(req.params.id).populate()
        // .populate("pid,sid")
        .populate({
            path: 'messages',
            populate: [
                { path: 'pid' }, // Populate the 'pid' field
                { 
                    path: 'sid',
                    populate: { path: 'UserId' } // Populate a nested field within 'sid'
                } 
            ]
        });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to update a chat by ID
const updateChat = async (req, res) => {
    try {
        const { participants, messages, attachments } = req.body;
        const chat = await Chat.findByIdAndUpdate(req.params.id, { participants, messages, attachments }, { new: true });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to delete a chat by ID
const deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports={
    createChat,
    getAllChats,
    getChatById
}