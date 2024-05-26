const express = require('express');


const { makeOreder, orderInProgress, orderDetails, allOrdersOfBoutique, assignedDriver, newOrder, orderInprogres } = require('../controllers/orderController');
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
// get new order 
router.get('/newOrder',newOrder)
// get inprogress order
router.get('/orderInprogres',orderInprogres)

module.exports = router;