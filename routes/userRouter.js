const express = require('express');
const router = express.Router();

//import controllers
const { signUp, signIn, forgotPassword, verifyCode, cahngePassword, resendOtp, userBlocked, logoutController, updateProfile } = require('../controllers/userController');
const upload = require('../middlewares.js/fileUpload');
const { addVehicle, findAllDrivers, findNearByDriver, updatedVehical } = require('../controllers/vehicalController');
const { signUpBoutique, updateProfileOfboutique } = require('../controllers/boutiqueController');
const { createLocation, getLocations, getLocationById, updateLocation } = require('../controllers/locationController');

console.log('userController');

// routes
router.post('/sign-up', upload, signUp);
router.post('/sign-in', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/change-password', cahngePassword);
// if user want to diable Account
router.post('/userBlocked', userBlocked);
//logout route
router.post('/logout',logoutController)
// opt resend
router.post("/resend",resendOtp)
// update profile
router.patch('/updateProfile', upload ,updateProfile)

// router.post('/vehicalDetails/:userId',upload.array["image",3],addVehicle)
// driver route
router.post('/vehicalDetails', upload, addVehicle);
router.get('/findAllDrivers',findAllDrivers)
router.get('/findNearByDriver',findNearByDriver)
router.patch('/updatedVehical', upload,updatedVehical)
// boutique signup route 
router.post('/signUp-Boutique', upload, signUpBoutique);
router.patch('/updateProfile-Boutique', upload, updateProfileOfboutique);
// location 
router.post('/locations',createLocation);
router.get('/locations',getLocations);
router.get('/locations/:id',getLocationById);
router.put('/updateLocation',updateLocation);
module.exports = router;