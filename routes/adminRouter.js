const express = require('express');
const { caretTermsAdnControllerForAdmin } = require('../controllers/termsOfUseController');
const { getTotalOfTheDashboared, totalRevinew, feedbackRatio, todayorderDetailsinDashboared } = require('../controllers/dashboard/analysisController');

const router = express.Router();

// admin route of  create terms and users
router.post('/caretTermsAdnControllerForAdmin',caretTermsAdnControllerForAdmin)

// analysise
router.get('/getTotalOfTheDashboared',getTotalOfTheDashboared)
router.get('/totalRevinew',totalRevinew)
router.get('/feedbackRatio',feedbackRatio)
router.get('/todayorderDetailsinDashboared',todayorderDetailsinDashboared)

module.exports = router;