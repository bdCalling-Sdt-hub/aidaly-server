const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    UserId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true
    },
   text:{type:String,required:false},
   file:{type:String,required:false},
   messageType:{
    type:String,
    enum: ['text', 'file','text/file'],
    required:true
    

   }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
