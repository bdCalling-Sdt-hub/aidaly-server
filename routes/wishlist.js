const express = require('express');
const { createWishList } = require('../controllers/wishListController');
const router = express.Router();

router.post('/addwishlist/:id',createWishList)
module.exports = router;