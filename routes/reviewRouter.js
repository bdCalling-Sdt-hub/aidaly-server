
const express = require('express');
const { createRewiew, showAllReciewForProduct } = require('../controllers/reviewController');
const upload = require('../middlewares.js/fileUpload');
const router = express.Router();

router.post('/createReview/:id',upload,createRewiew)
router.get('/getReviewForProduct/:id',showAllReciewForProduct)


module.exports = router;