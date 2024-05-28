const express = require('express');


const { makeOreder, orderInProgress, orderDetails, allOrdersOfBoutique, assignedDriver, newOrder, orderInprogresShow, inprogresOrderDetails, assignedOrderedShowe, findNearByDriver } = require('../controllers/orderController');
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
router.get('/orderInprogresShow',orderInprogresShow)
// show inprogress details
router.get('/inprogresOrderDetails/:id',inprogresOrderDetails)
// show assigned  ordered 
router.get('/assignedOrderedShow',assignedOrderedShowe)
// show all driver who is online 
router.get('/findNearByDriver',findNearByDriver)

module.exports = router;