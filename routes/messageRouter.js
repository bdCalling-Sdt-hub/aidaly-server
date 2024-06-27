
const express = require('express');

const upload = require('../middlewares.js/fileUpload');
const { createChat, getAllChatForTheUser } = require('../controllers/chatController');
const { createMessage, showMessages, messageWithImage } = require('../controllers/messageController');
const router = express.Router();

router.post('/createChat',createChat)
router.get('/getAllChatForTheUser',getAllChatForTheUser)

// message router 
// //----------#---------------
router.post('/createMessage',createMessage)
router.get('/showMessages',showMessages)
router.post('/messageWithImage',upload,messageWithImage)


module.exports=router