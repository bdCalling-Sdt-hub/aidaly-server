// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//     participants: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }],
//     messages: [id={
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Message',
//         required:true
//     }],
  
// }, { timestamps: true });

// const Chat = mongoose.model('Chat', chatSchema);

// module.exports = Chat;
// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//     participants: [
       
//         pid={
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true
//         },
//         sid={
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true
//         }
//     ],
//     messages: [
        
//         pid={
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Message',
//             required: true
//         },
//         sid={
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Message',
//             required: true
        
//     }]
// }, { timestamps: true });

// const Chat = mongoose.model('Chat', chatSchema);

// module.exports = Chat;
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
   
        pid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
  
    messages: [{
        pid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: false
        },
        sid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: false
        }
    }]
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

