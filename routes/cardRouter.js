const express = require('express');

const { AddCard, showCard } = require('../controllers/cardController');
const upload = require('../middlewares.js/fileUpload');
const router = express.Router();

router.post('/addcard',upload,AddCard)
router.get('/showCard',showCard)
module.exports = router;