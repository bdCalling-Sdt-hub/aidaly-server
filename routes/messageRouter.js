
const express = require('express');

// const { AddCard, showCard } = require('../controllers/cardController');
// const upload = require('../middlewares.js/fileUpload');
const { createMessage } = require('../controllers/messageController');
const { createChat } = require('../controllers/chatController');
const router = express.Router();



// create message ---------------------

router.post('/createMessage',createMessage)
// router.get('/showCard',showCard)

// chat controller
router.post('/createChat',createChat)
module.exports = router;