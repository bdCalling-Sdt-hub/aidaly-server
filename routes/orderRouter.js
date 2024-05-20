const express = require('express');


const { makeOreder } = require('../controllers/orderController');
const router = express.Router();

router.post('/makeOrder',makeOreder)

module.exports = router;