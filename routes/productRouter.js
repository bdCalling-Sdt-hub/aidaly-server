const express = require('express');
const { productCreate, showProductByUser, allProducts, showProductByCategory, ProductDetails } = require('../controllers/productController');
const upload = require('../middlewares.js/fileUpload');
const { createCategory, getallCategory, getallCategoryWithProductImage } = require('../controllers/categoryController');
const router = express.Router();

// router
router.post('/createProduct',upload,productCreate)
router.get('/showProductByUser',showProductByUser)
router.get('/allProducts',allProducts)
router.get('/ProductDetails',ProductDetails)

// product catogray route
router.post('/createCatery',upload,createCategory)
router.get('/getallCategory',getallCategory)
router.get('/showProductByCategory/:category',showProductByCategory)
router.get('/getallCategoryWithProductImage',getallCategoryWithProductImage)


module.exports = router;