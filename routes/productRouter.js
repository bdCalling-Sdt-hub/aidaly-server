const express = require('express');
const { productCreate, showProductByUser, allProducts, showProductByCategory, ProductDetails, showProductByUserId, updatedTheProduct } = require('../controllers/productController');
const upload = require('../middlewares.js/fileUpload');
const { createCategory, getallCategory, getallCategoryWithProductImage } = require('../controllers/categoryController');
const router = express.Router();

// router
router.post('/createProduct',upload,productCreate)
router.get('/showProductByUser',showProductByUser)
router.get('/allProducts',allProducts)
router.get('/ProductDetails',ProductDetails)
router.get('/showProductByUserId/:id',showProductByUserId)
router.patch('/updatedTheProduct/:id',upload,updatedTheProduct)



// product catogray route
router.post('/createCatery',upload,createCategory)
router.get('/getallCategory',getallCategory)
router.get('/showProductByCategory/:category',showProductByCategory)
router.get('/getallCategoryWithProductImage',getallCategoryWithProductImage)


module.exports = router;