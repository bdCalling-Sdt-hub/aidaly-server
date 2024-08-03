// const Response = require("../../helpers/response");
const Chat = require("../models/Chat");
const jwt = require("jsonwebtoken");
const Response = require("../helpers/response");
const Message = require("../models/Message");

// // create chat
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
//             return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
//         }
        
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
//         // Get receiverId from request query parameters
//         const { id } = req.query;

//         // Create members array for the chat
//         const members = {
//             senderId: decoded._id,
//             receiverId: id
//         };

        

//         // Check if a chat already exists between these members
//         // const findChat = await Chat.findOne({
         
//         //         $elemMatch: {
//         //             senderId: decoded._id,
//         //             receiverId: id
//         //         }
            
//         // });

//         // if (findChat) {
//         //     return res.status(200).json(Response({ statusCode: 200, message: 'Chat already exists.', status: 'ok', data: findChat }));
//         // }
//  // Check if a chat already exists between these members
//         const existingChat = await Chat.findOne({
//             $or: [
//                 { senderId: decoded._id, receiverId: id },
//                 { senderId: id, receiverId: decoded._id }
//             ]
//         });

//         if (existingChat) {
//             return res.status(200).json(Response({ statusCode: 200, message: 'Chat already exists.', status: 'ok', data: existingChat }));
//         }
//         // Create a new chat if no existing chat found
//         const newChat = new Chat( members );
//         const chat = await newChat.save();

//         return res.status(200).json(Response({ statusCode: 200, message: 'Chat created successfully.', status: 'OK', data: chat }));
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json(Response({ status: 'failed', message: error.message, statusCode: 500 }));
//     }
// };

// // get all chat 
// // ------#-----
// const getAllChatForTheUser = async (req, res) => {
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

//         // Find all chats where the user is either the sender or receiver
//         const chats = await Chat.find({
//             $or: [
//                 { senderId: decoded._id },
//                 { receiverId: decoded._id }
//             ]
//         });

//         if (chats.length === 0) {
//             return res.status(404).json({ statusCode: 404, message: 'You don\'t have any chats.', status: 'OK' });
//         }

//         // Extract unique chat IDs
//         const chatIds = chats.map(chat => chat._id);

//         // Find the latest message for each chat
//         const latestMessages = await Message.aggregate([
//             // Match messages that belong to any of the found chat IDs
//             { $match: { chatId: { $in: chatIds } } },
//             // Sort messages within each chat by descending createdAt (latest first)
//             { $sort: { createdAt: -1 } },
//             // Group by chatId and pick the first message (latest message)
//             {
//                 $group: {
//                     _id: '$chatId',
//                     latestMessage: { $first: '$$ROOT' } // $$ROOT gives the whole message document
//                 }
//             }
//         ]);

//         // Sort chats based on the createdAt of the latest message
//         chats.sort((chat1, chat2) => {
//             const latestMsg1 = latestMessages.find(msg => msg._id.toString() === chat1._id.toString());
//             const latestMsg2 = latestMessages.find(msg => msg._id.toString() === chat2._id.toString());

//             if (!latestMsg1) return 1; // chat1 has no messages
//             if (!latestMsg2) return -1; // chat2 has no messages

//             return latestMsg2.latestMessage.createdAt - latestMsg1.latestMessage.createdAt;
//         });

//         // Construct response data with chat details and latest messages
//         const chatData = chats.map(chat => {
//             const latestMessage = latestMessages.find(msg => msg._id.toString() === chat._id.toString());
//             return {
//                 chat,
//                 latestMessage: latestMessage ? latestMessage.latestMessage : null
//             };
//         });

//         return res.status(200).json({ statusCode: 200, message: 'Chats retrieved successfully.', status: 'OK', data: chatData });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 'failed', message: error.message, statusCode: 500 });
//     }
// };


// module.exports={
//     createChat,
//     getAllChatForTheUser
// }
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
            return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);

        const { id } = req.query;

        if (!id) {
            return res.status(400).json(Response({ statusCode: 400, message: 'User ID is required.', status: 'failed' }));
        }

        // Check if a chat already exists between the two users
        const existingChat = await Chat.findOne({
            $or: [
                { first: decoded._id, second: id },
                { first: id, second: decoded._id }
            ]
        });

        if (existingChat) {
            return res.status(400).json(Response({ statusCode: 400, message: 'Chat already exists.', status: 'failed' }));
        }

        // Create a new chat
        const data = {
            first: decoded._id,
            second: id
        };

        const newChat = await Chat.create(data);
        return res.status(200).json(Response({ statusCode: 200, message: 'Chat created successfully.', status: 'success', data: newChat }));

    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
    }
};

// const showChat=async(req,res)=>{
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
//         console.log(decoded);
//         const findChat=await Chat.find({ $or: [
//             { first: decoded._id, second: decoded._id },
//             // { first: id, second: decoded._id }
//         ]})
//         return res.status(200).json(Response({ statusCode: 200, message: 'Chat created successfully.', status: 'success', data: findChat }));

//     } catch (error) {
//         return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));

//     }
// }
// const showChat = async (req, res) => {
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

//         // Find chats where the logged-in user is participant
//         const chats = await Chat.find({
//             $or: [
//                 { first: decoded._id },
//                 { second: decoded._id }
//             ]
//         }).sort({ updatedAt: -1 }); // Sort by updatedAt to get the most recent chats first

//         // Array to store formatted chat data with last message
//         let formattedChats = [];

//         // Iterate through each chat to find the last message
//         for (let chat of chats) {
//             // Find the last message for this chat
//             const lastMessage = await Message.findOne({ chatId: chat._id }).sort({ createdAt: -1 });

//             // Format chat data with last message
//             const formattedChat = {
//                 _id: chat._id,
//                 first: chat.first,
//                 second: chat.second,
//                 lastMessage: lastMessage ? {
//                     textMessage: lastMessage.textMessage,
//                     messageType: lastMessage.messageType,
//                     createdAt: lastMessage.createdAt
//                 } : null
//             };

//             formattedChats.push(formattedChat);
//         }

//         return res.status(200).json(Response({ statusCode: 200, message: 'Chats fetched successfully.', status: 'success', data: formattedChats }));

//     } catch (error) {
//         return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
//     }
// };
// const showChat = async (req, res) => {
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

//         // Find chats where the logged-in user is a participant
//         const chats = await Chat.find({
//             $or: [
//                 { first: decoded._id },
//                 { second: decoded._id },
//                 { member: decoded._id } // For group chats
//             ]
//         }).sort({ updatedAt: -1 }); // Sort by updatedAt to get the most recent chats first

//         // Array to store formatted chat data with last message
//         let formattedChats = [];

//         // Iterate through each chat to find the last message
//         for (let chat of chats) {
//             // Determine if the chat is a single chat or group chat
//             const isGroupChat = chat.member && chat.member.length > 0;

//             // Find the last message for this chat
//             const lastMessage = await Message.findOne({ chatId: chat._id }).sort({ createdAt: -1 });
//             const lastMessageOfGroup = await GroupMessage.findOne({ chatId: chat._id }).sort({ createdAt: -1 });

//             // Format chat data with last message
//             const formattedChat = {
//                 _id: chat._id,
//                 first: chat.first,
//                 second: chat.second,
//                 member: isGroupChat ? chat.member : undefined, // Include members only for group chats
//                 lastMessage: lastMessage ? {
//                     textMessage: lastMessage.textMessage,
//                     messageType: lastMessage.messageType,
//                     createdAt: lastMessage.createdAt
//                 } : lastMessageOfGroup?{textMessage: lastMessage.textMessage,
//                     messageType: lastMessage.messageType,
//                     createdAt: lastMessage.createdAt}
//             };

//             formattedChats.push(formattedChat);
//         }

//         return res.status(200).json(Response({ statusCode: 200, message: 'Chats fetched successfully.', status: 'success', data: formattedChats }));

//     } catch (error) {
//         return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
//     }
// };
const showChat = async (req, res) => {
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

        // Find chats where the logged-in user is a participant
        const chats = await Chat.find({
            $or: [
                { first: decoded._id },
                { second: decoded._id },
                // { member: decoded._id } // For group chats
            ]
        }).sort({ updatedAt: -1 }); // Sort by updatedAt to get the most recent chats first

        // Array to store formatted chat data with last message
        // let formattedChats = [];

        // // Iterate through each chat to find the last message
        // for (let chat of chats) {
        //     // Determine if the chat is a group chat
        //     const isGroupChat = chat.member && chat.member.length > 0;

        //     // Find the last message for this chat
        //     let lastMessage;
        //     if (isGroupChat) {
        //         // For group chats, query the GroupMessage collection
        //         lastMessage = await GroupMessage.findOne({ chatId: chat._id }).sort({ createdAt: -1 });
        //     } else {
        //         // For single chats, query the Message collection
        //         lastMessage = await Message.findOne({ chatId: chat._id }).sort({ createdAt: -1 });
        //     }

        //     // Format chat data with last message
        //     const formattedChat = {
        //         _id: chat._id,
        //         first: chat.first,
        //         second: chat.second,
        //         member: isGroupChat ? chat.member : undefined, // Include members only for group chats
        //         lastMessage: lastMessage ? {
        //             textMessage: lastMessage.textMessage,
        //             messageType: lastMessage.messageType,
        //             createdAt: lastMessage.createdAt
        //         } : null
        //     };

        //     formattedChats.push(formattedChat);
        // }

        return res.status(200).json(Response({ statusCode: 200, message: 'Chats fetched successfully.', status: 'success', data: chats }));

    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message, status: 'server error' }));
    }
};



module.exports={
    createChat,
    showChat
}