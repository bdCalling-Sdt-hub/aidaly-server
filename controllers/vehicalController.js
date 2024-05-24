
const Response = require("../helpers/response");
const Driver = require("../models/Driver");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const addVehicle = async (req, res, next) => {
   
    // Get the token from the request headers
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        // Extract the token without the 'Bearer ' prefix
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is missing.' });
    }

    try {
        // Verify the token
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });

        console.log(decoded.role,"this role")
        // Proceed with authentication or authorization logic

        // Find the user by ID from the decoded token
        const user = await User.findOne({ _id: decoded._id, role:"driver" });

        if (!user) {
            return res.status(401).json({ success: false, message: 'your are not a driver .' });
        }

        // Check if the driver has already added a vehicle
        const existingVehicle = await Driver.findOne({ userId: decoded._id }).exec();

        if (existingVehicle) {
            return res.status(400).json({ success: false, message: 'Driver has already added a vehicle.' });
        }

        // If the driver is valid and has not added a vehicle yet
        const { make, model, year,registrationNumber } = req.body;
        const { driverLicense, registration, policeCheck,  } = req.files;

        // Create a new vehicle object with user ID
        const newVehicle = new Driver({
            userId: decoded._id,
            make,
            model,
            year,registrationNumber,
            driverLicense:driverLicense[0],
            registration:registration[0],
            policeCheck:policeCheck[0],
           
        });

        // Save the new vehicle to the database
        const data =await newVehicle.save();

        // return res.status(200).json({ success: true, message: 'Vehicle added successfully.' });
        res.status(200).json(Response({statusCode:200,status:"success", message: "vehical added successfully",data:{data} }));
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:"failed" }));
    }
};

const findAllDrivers=async(req,res,next)=>{

    try {
        const allDrivers = await User.find({ role: 'driver' });
        res.status(200).json(Response({statusCode:200,status:"ok",message:"fetched successfully ", data:allDrivers}))
        
    } catch (error) {
        return res.status(500).json(Response({ statusCode: 500, message: error.message,status:"failed" }));
    }
}
const findNearByDriver=async(req,res,next)=>{
    const boutique = req.query.boutiqueId;
console.log(boutique)
    function calculateDistance(boutique, driver) {
        const R = 6371; // Radius of the Earth in kilometers
        const lat1 = boutique.latitude;
        const lon1 = boutique.longitude;
        const lat2 = driver.latitude;
        const lon2 = driver.longitude;
        const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }

    try { 
        // Boutique location 
        const boutiqueLocation = await User.findById(boutique);
        console.log(boutiqueLocation.currentLocation,"boutiqe");
   
        const allDrivers = await User.find({ role: 'driver' });
        const drivers = allDrivers.map(driver => driver.currentLocation);
    

        // Calculate distances and filter drivers within one kilometer
        const nearbyDrivers = drivers.filter(driver => {
            const distance = calculateDistance(boutiqueLocation.currentLocation, driver);
            console.log(distance < 1.5);
            return distance < 1.5; // Filter drivers within one kilometer
        });
        
        
        const userIds = nearbyDrivers.map(item => item.userId);
        const AllNearbyDriver = await User.find({ _id: { $in: userIds } });
     

    
            res.status(200).json(Response({ status: "success", statusCode: 200, message: "Updated for assigned driver", data: AllNearbyDriver }));
        
    } catch (error) {
        // Server error
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
    }
}

module.exports = { addVehicle,findAllDrivers ,findNearByDriver};
