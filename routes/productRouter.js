const express = require('express');
const { productCreate, showProductByUser, allProducs } = require('../controllers/productController');
const upload = require('../middlewares.js/fileUpload');
const { createCategory, getallCategory } = require('../controllers/categoryController');
const router = express.Router();

// router
router.post('/createProduct',upload,productCreate)
router.get('/showProductByUser',showProductByUser)
router.get('/allProducs',allProducs)

// product catogray route
router.post('/createCatery',createCategory)
router.get('/getallCategory',getallCategory)


module.exports = router;