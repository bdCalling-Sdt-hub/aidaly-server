const express = require('express');
const { caretTermsAdnControllerForAdmin } = require('../controllers/termsOfUseController');
const { getTotalOfTheDashboared, totalRevinew, feedbackRatio, todayorderDetailsinDashboared, totalCostAndSell } = require('../controllers/dashboard/analysisController');
const {  blocakShopper, getShoperByOrder, } = require('../controllers/dashboard/shopperInDashboardController');
const { getAllBoutiqueForAdmin, boutiqueDetails,sendFeedback,updateProfileOfboutiqueInDashboared, addBoutique } = require('../controllers/dashboard/boutiqueInDashboared');
const { showAllDriverInDashboared, showDriverDetails, driverDashboared } = require('../controllers/dashboard/driverInDashboared');
const upload = require('../middlewares.js/fileUpload');

const router = express.Router();

// admin route of  create terms and users
router.post('/caretTermsAdnControllerForAdmin',caretTermsAdnControllerForAdmin)

// analysise
router.get('/getTotalOfTheDashboared',getTotalOfTheDashboared)
router.get('/totalRevinew',totalRevinew)
router.get('/feedbackRatio',feedbackRatio)
router.get('/todayorderDetailsinDashboared',todayorderDetailsinDashboared)
router.get('/totalCostAndSell',totalCostAndSell)
// shopper in admin
// router.get('/getAllShopperForAdmin',getAllShopperForAdmin)
router.patch('/blocakShopper',blocakShopper)
router.get('/getShoperByOrder',getShoperByOrder)
// boutique in admin 
router.get('/getAllBoutiqueForAdmin',getAllBoutiqueForAdmin)
router.get('/boutiqueDetails',boutiqueDetails)
router.post('/sendFeedback',upload,sendFeedback)
router.patch('/updateProfileOfboutiqueInDashboared',upload,updateProfileOfboutiqueInDashboared)
// driver in admin 
router.get('/showAllDriverInDashboared',showAllDriverInDashboared)
router.get('/showDriverDetails',showDriverDetails)
router.get('/driverDashboared',driverDashboared)
router.post('/addBoutique',upload,addBoutique)

module.exports = router;