const express = require('express');
const { createWishList, getAllWishlist, createWishListCollection } = require('../controllers/wishListController');
const router = express.Router();

router.post('/addwishlist/:id',createWishList)
router.get('/getAllWishlist',getAllWishlist)
router.post('/createWishListCollection',createWishListCollection)
module.exports = router;