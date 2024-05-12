const express = require('express');
const { productCreate, showProductByUser } = require('../controllers/productController');
const upload = require('../middlewares.js/fileUpload');
const router = express.Router();

// router
router.post('/createProduct',upload,productCreate)
router.get('/showProductByUser',showProductByUser)

module.exports = router;