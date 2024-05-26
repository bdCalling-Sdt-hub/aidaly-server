const { createServer } = require('node:http');
const { Server } = require('socket.io');

// const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Types;


const { connectToDatabase } = require('../helpers/connection');
const app = require('../app');
const User = require('../models/User');
const Driver = require('../models/Driver');
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
         // Update driver status to "active" when they connect
        // const driveractiv= await updateDriverStatus(socket.id, "active");
        // console.log(driveractiv,"active")


        socket.on('disconnect', () => {
            console.log(`Client disconnected`);
        });

        socket.on('findNearbyDrivers', async (data) => {
            const id = socket.handshake.query.id;
            function calculateDistance(boutique, driver) {
                const R = 6371 ;  // Radius of the Earth in kilometers
                const lat1 = boutique.latitude;
                const lon1 = boutique.longitude;
                const lat2 = driver.latitude;
                const lon2 = driver.longitude;
                const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                          Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = R * c; // Distance in kilometers
                return distance;
            }

            try {
                // Find the boutique
                const boutique = await User.findById(id);

                // Get the boutique's location
                const boutiqueLocation = boutique.currentLocation;

                // Find nearby drivers within 1 kilometer radius of the boutique's location
                const drivers = await Driver.find().populate("userId");
               
                 // Calculate distances and filter drivers within one kilometer
        // const nearbyDrivers = drivers.filter(driver => {
           
        //     const distance = calculateDistance(boutiqueLocation, driver.userId.currentLocation);
        //     console.log(distance );
        //     return distance < 1; // Filter drivers within one kilometer
        // });
        const nearbyDrivers = drivers.filter(driver => {
            // Check if the driver is active
            if (driver.userId.status === 'active') {
                // Calculate the distance between the boutique's location and the driver's current location
                const distance = calculateDistance(boutiqueLocation, driver.userId.currentLocation);
                // Log the distance for debugging
                console.log(distance);
                // Return true if the driver is within one meter from the boutique's location
                return distance <1.5; // One meter in kilometers
            }
            // Return false if the driver is not active
            return false;
        });
        
        console.log(nearbyDrivers)

                // // Extracting the locations of nearby drivers
                // const driverLocations = nearbyDrivers.map(driver => driver.userId.currentLocation);

               

                // Emit the nearby drivers data to the client with an event name 'nearbyDrivers'
                socket.emit('nearbyDrivers', {
                    status: "success",
                    message: "Found nearby drivers",
                    data: nearbyDrivers
                });

            } catch (error) {
                // Handle errors here
                console.error(error.message);
                // Emit error message to the client
                socket.emit('nearbyDriversError', {
                    error: "An error occurred while processing the request"
                });
            }
        });

    });
};

// async function updateDriverStatus(driverId, status) {
//     // Update the driver's status in the database
//     try {
//         await Driver.updateOne({ userId: driverId }, { status: status });
//     } catch (error) {
//         console.error(`Error updating driver status: ${error.message}`);
//     }
// }


module.exports = socketIO;
