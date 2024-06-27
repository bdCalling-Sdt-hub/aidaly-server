const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
   chatId:{type:mongoose.Schema.Types.ObjectId,ref:"Chat",required:true},
   senderId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
   receiverId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
   text:{type:String,required:false},
   image:{type:Object,default:false},
   messageType:{type:String,required:true,enum:["text","file",]}
}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
