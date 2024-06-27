const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    
        
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            receiverId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        
    
}, {
    timestamps: true
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
