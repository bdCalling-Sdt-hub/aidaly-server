
const express = require('express');
const { createRewiew, showAllReciewForProduct, updateRatingForboutique } = require('../controllers/reviewController');
const upload = require('../middlewares.js/fileUpload');
const router = express.Router();

router.post('/createReview/:id',upload,createRewiew)
router.get('/getReviewForProduct/:id',showAllReciewForProduct)
router.get('/getReviewForProducts/:id',updateRatingForboutique)


module.exports = router;