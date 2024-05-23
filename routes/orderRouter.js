const express = require('express');


const { makeOreder, orderInProgress, orderDetails, allOrdersOfBoutique, assignedDriver } = require('../controllers/orderController');
const router = express.Router();

router.post('/makeOrder',makeOreder)
// order statuse update
router.patch('/orderInprogres/:id',orderInProgress)
// order details
router.get('/orderDetails/:id',orderDetails)
// all  ordered of butique product
router.get('/allOrdersOfBoutique',allOrdersOfBoutique)
// assigned driver
router.patch('/assignedDriver/:id',assignedDriver)

module.exports = router;