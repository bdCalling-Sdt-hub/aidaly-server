const express = require('express');
const { createWishList, getAllWishlist } = require('../controllers/wishListController');
const router = express.Router();

router.post('/addwishlist/:id',createWishList)
router.get('/getAllWishlist',getAllWishlist)
module.exports = router;