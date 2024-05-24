const { createServer } = require('node:http');
const { Server } = require('socket.io');

// const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Types;


const { connectToDatabase } = require('../helpers/connection');
const app = require('../app');
// const { getCurrentTime, saveMessage, createChat } = require('./messageController');
// const Chat = require('../models/Chat');
// const Response = require('../helpers/response');


const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


// Connect to the MongoDB database
connectToDatabase();


const socketIO = (io) => {
    
    console.log("Socket server is lenening on port 300")
    io.on('connection', (socket) => {
        console.log(` New client connected`);

        socket.on('disconnect', () => {
            console.log(` Client disconnected`);
        });

        socket.on('message', async (msg, callback) => {
            try {

                console.log(msg,callback());

                // // Search for existing chat between sender and receiver, regardless of the order of senderId and participant
                // const searchChat = await Chat.findOne({
                //     $or: [
                //         { senderId: msg.senderId, participant: msg.participant },
                //         { senderId: msg.participant, participant: msg.senderId }
                //     ]
                // });

                // // If chat does not exist, create a new one
                // if (!searchChat) {
                //     // Create chat and wait for the result
                //     const newChat = await createChat(msg);
                //     msg.chatId = newChat._id;
                // } else {
                //     msg.chatId = searchChat._id;
                // }

                // // Save message
                // const message = await saveMessage(msg);

                // // Send message to specific user
                // io.emit(`new::${msg.chatId}`, message);

                // Response back
                callback({
                    message: "message",
                    type: "Message",
                    
                });

            } catch (error) {
                console.error(error.message);
                // Handle errors here
                callback({
                    error: "An error occurred while processing the message",
                    type: "Error",
                });
            }
        });

    });
};


module.exports = socketIO;
