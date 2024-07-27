const express = require('express');
const { caretTermsAdnControllerForAdmin } = require('../controllers/termsOfUseController');
const { getTotalOfTheDashboared, totalRevinew, feedbackRatio, todayorderDetailsinDashboared } = require('../controllers/dashboard/analysisController');
const {  blocakShopper, getShoperByOrder, } = require('../controllers/dashboard/shopperInDashboardController');
const { getAllBoutiqueForAdmin, boutiqueDetails } = require('../controllers/dashboard/boutiqueInDashboared');
const { showAllDriverInDashboared, showDriverDetails } = require('../controllers/dashboard/driverInDashboared');

const router = express.Router();

// admin route of  create terms and users
router.post('/caretTermsAdnControllerForAdmin',caretTermsAdnControllerForAdmin)

// analysise
router.get('/getTotalOfTheDashboared',getTotalOfTheDashboared)
router.get('/totalRevinew',totalRevinew)
router.get('/feedbackRatio',feedbackRatio)
router.get('/todayorderDetailsinDashboared',todayorderDetailsinDashboared)
// shopper in admin
// router.get('/getAllShopperForAdmin',getAllShopperForAdmin)
router.patch('/blocakShopper',blocakShopper)
router.get('/getShoperByOrder',getShoperByOrder)
// boutique in admin 
router.get('/getAllBoutiqueForAdmin',getAllBoutiqueForAdmin)
router.get('/boutiqueDetails',boutiqueDetails)
// driver in admin 
router.get('/showAllDriverInDashboared',showAllDriverInDashboared)
router.get('/showDriverDetails',showDriverDetails)

module.exports = router;