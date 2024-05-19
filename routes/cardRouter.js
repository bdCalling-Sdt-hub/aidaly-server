const express = require('express');

const { AddCard } = require('../controllers/cardController');
const upload = require('../middlewares.js/fileUpload');
const router = express.Router();

router.post('/addcard',upload,AddCard)
module.exports = router;