const { createServer } = require('node:http');
const { Server } = require('socket.io');



const { connectToDatabase } = require('../helpers/connection');
const app = require('../app');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Response = require('../helpers/response');
const pagination = require('../helpers/pagination');
const Location = require('../models/Location');
const Order = require('../models/Order');



const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


// Connect to the MongoDB database
connectToDatabase();


// const socketIO = (io) => {
    
//     console.log("Socket server is lenening on port 300")
//     io.on('connection', (socket) => {
//         console.log(` New client connected`);

//         socket.on('disconnect', () => {
//             console.log(` Client disconnected`);
//         });

//         socket.on('message', async (msg, callback) => {
//             try {

//                 console.log(msg,callback());


//                 // // Search for existing chat between sender and receiver, regardless of the order of senderId and participant
//                 // const searchChat = await Chat.findOne({
//                 //     $or: [
//                 //         { senderId: msg.senderId, participant: msg.participant },
//                 //         { senderId: msg.participant, participant: msg.senderId }
//                 //     ]
//                 // });

//                 // // If chat does not exist, create a new one
//                 // if (!searchChat) {
//                 //     // Create chat and wait for the result
//                 //     const newChat = await createChat(msg);
//                 //     msg.chatId = newChat._id;
//                 // } else {
//                 //     msg.chatId = searchChat._id;
//                 // }

//                 // // Save message
//                 // const message = await saveMessage(msg);

//                 // // Send message to specific user
//                 // io.emit(`new::${msg.chatId}`, message);

//                 // Response back
//                 callback({
//                     message: "message",
//                     type: "Message",
                    
//                 });

//             } catch (error) {
//                 console.error(error.message);
//                 // Handle errors here
//                 callback({
//                     error: "An error occurred while processing the message",
//                     type: "Error",
//                 });
//             }
//         });

//     });
// };



const socketIO = (io) => {
    console.log("Socket server is listening on port 300");

    io.on('connection', async(socket) => {
        console.log(`New client connected`);
         
    socket.on('userActive',async(data)=>{
        
        const user = await User.findById(data.id);
        console.log(data.id,data.status)
        // console.log(user)
        user.status = data.status;
        await user.save();
    })

    socket.on('test',(data) =>{
        socket.emit('test2',{"name":"hello"})
    })
      
socket.on('locationUpdate',async(data)=>{
   
    try {
                        // console.log(data,callback(),"i am givm");

        const { id, latitute, longitude,status } = data;
        // console.log(data);
    
        const locationFind = await Location.find({userId:id});
        const location=locationFind[0]
        // console.log(location.currentLocation.latitude);
        // console.log(location.currentLocation.longitude);
        // console.log(location)
    
        location.latitude = latitute;
        location.longitude = longitude;
    
        await location.save();
        const user=await Location.find({userId:id})
        console.log(latitute,longitude,location,user)

    
const orderTrac = await Order.find({ assignedDriver:id, assignedDrivertrack: status }).populate("assignedDriver")
console.log(orderTrac)
        
        if (orderTrac && orderTrac.length > 0) {
            
const event=`orderStatus`
            io.emit(event, { orderId: orderTrac[0]._id, status: orderTrac[0].status, assignedDrivertrack: orderTrac[0].assignedDrivertrack,location:user[0] });
            console.log("Order status emitted successfully!");
            // Response back
                // callback({
                //     message: "orderStatus",
                //     type: "orderStatus",
                    
                // });
        } else {
            console.log("Driver is not currently tracking any order.",);
        }



    } catch (error) {
        console.error("Error updating location:", error);
        // Handle the error here, e.g., return an error response
        // res.status(500).json({ error: "Internal server error" });
        // Handle errors here
                // callback({
                //     error: "An error occurred while processing the message",
                //     type: "Error",
                // });
    }
    
})
// socket.on('locationUpdate', async (data, callback) => {
//     try {
//         const { id, latitute, longitude, status } = data;

//         const locationFind = await Location.find({ userId: id });
//         const location = locationFind[0];

//         console.log(location);

//         location.latitude = latitute;
//         location.longitude = longitude;

//         await location.save();

//         const orderTrac = await Order.find({ assignedDriver: id, assignedDrivertrack: status });

//         if (orderTrac && orderTrac.length > 0) {
//             const event = `orderStatus`;
//             socket.emit(event, { orderId: orderTrac[0]._id, status: orderTrac[0].status, assignedDrivertrack: orderTrac[0].assignedDrivertrack });
//             console.log("Order status emitted successfully!", orderTrac);

//             // Response back
           
//                 callback({
//                     message: "orderStatus",
//                     type: "orderStatus",
//                 });
            
//         } else {
//             console.log("Driver is not currently tracking any order.");
//         }
//     } catch (error) {
//         console.error("Error updating location:", error);
//         // Handle errors here
       
//             callback({
//                 error: "An error occurred while processing the message",
//                 type: "Error",
//             });
        
//     }
// });


// socket.on('locationUpdate', async (data, callback) => {


//     try {
//         const { id, latitude, longitude, status } = data;
// console.log(data)
//         // Update the location
//         const location = await Location.findOneAndUpdate(
//             { userId: id },
//             { latitude, longitude },
//             { new: true, upsert: true }
//         );

//         const orderTrac = await Order.find({ assignedDriver: id, assignedDrivertrack: status });
//         console.log(orderTrac)

//         if (orderTrac && orderTrac.length > 0) {
//             const event = `orderStatus`;
//             // Emit order status event to the client
//             socket.emit(event, { orderId: orderTrac[0]._id, status: orderTrac[0].status, assignedDrivertrack: orderTrac[0].assignedDrivertrack });
//             console.log("Order status emitted successfully!", orderTrac);

//             // Response back to the client
//             if (callback && typeof callback === 'function') {
//                 callback({ message: "orderStatus", type: "orderStatus" });
//             }
//         } else {
//             console.log("Driver is not currently tracking any order.");
//             // Provide feedback to the client
//             if (callback && typeof callback === 'function') {
//                 callback({ message: "Driver is not currently tracking any order", type: "NoOrder" });
//             }
//         }
//     } catch (error) {
//         console.error("Error updating location:", error);
//         // Handle errors
//         if (callback && typeof callback === 'function') {
//             callback({ error: "An error occurred while processing the message", type: "Error" });
//         }
//     }
// });

        socket.on('disconnect', async() => {
            console.log("you are disconnect")
            
        });


    });
};



module.exports = socketIO;
