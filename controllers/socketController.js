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
const Message = require('../models/Message');



const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


// Connect to the MongoDB database
connectToDatabase();




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

        const { id, latitute, longitude,status,deliveryTime } = data;
        // console.log(data);
    
        const locationFind = await Location.find({userId:id});
        const location=locationFind[0]
      
    
        location.latitude = latitute;
        location.longitude = longitude;
    
        await location.save();
        const user=await Location.find({userId:id})

    
const orderTrac = await Order.find({ assignedDriver:id, assignedDrivertrack: status }).populate("assignedDriver")
console.log(orderTrac)
        
        if (orderTrac && orderTrac.length > 0) {
            
const event=`orderStatus`
            io.emit(event, { orderId: orderTrac[0]._id, status: orderTrac[0].status, assignedDrivertrack: orderTrac[0].assignedDrivertrack,location:user[0],deliveryTime:deliveryTime });
            console.log("Order status emitted successfully!");
            
        } else {
            console.log("Driver is not currently tracking any order.",);
        }



    } catch (error) {
        console.error("Error updating location:", error);

    }
    
})

socket.on('message',async(data) =>{
    const {text,chatId,receiverId,sendId}=data
    console.log(text,chatId,receiverId,sendId)

    const message={
        chatId:chatId,
        senderId:sendId,
        receiverId:receiverId,
        text:text,
        messageType:"text"


    }
    const createMessage= await Message.create(message)
    console.log(createMessage)           
    io.emit("sendMessage",{message:createMessage.text} );

    // socket.emit('test2',{"name":"hello",data})
})

        socket.on('disconnect', async() => {
            console.log("you are disconnect")
            
        });


    });
};



module.exports = socketIO;
