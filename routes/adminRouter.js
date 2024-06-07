const express = require('express');
const { caretTermsAdnControllerForAdmin } = require('../controllers/termsOfUseController');

const router = express.Router();

// admin route of  create terms and users
router.post('/caretTermsAdnControllerForAdmin',caretTermsAdnControllerForAdmin)

module.exports = router;