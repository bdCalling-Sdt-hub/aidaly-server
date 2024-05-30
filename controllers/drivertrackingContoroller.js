const Response = require("../helpers/response")
const Order = require("../models/Order")
const jwt = require("jsonwebtoken");

const pagination = require("../helpers/pagination");
const Cancelled = require("../models/Cancelled");

// tracking controller for driver tracking
//--------------##################

const wayToPickupDriver=async(req,res,next)=>{
    try {
        const id=req.params.id
        
        
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
        
    }
}