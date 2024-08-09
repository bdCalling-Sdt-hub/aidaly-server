const Response = require("../helpers/response");
const Category = require("../models/Category");
const jwt = require("jsonwebtoken");

// Create category
const createCategory = async (req, res, next) => {
    

try {
    const { name,sizeType } = req.body;
    const {categoryImage} = req.files;
    if(!categoryImage){
        return res.status(404).json(Response({ statusCode: 404, message: 'pleace input image.',status:'faield' }));
    
    
    }

const files = [];
if (req.files) {
    categoryImage.forEach((categoryImage) => {
    const publicFileUrl = `/images/users/${categoryImage.filename}`;
    
    files.push({
      publicFileUrl,
      path: categoryImage.filename,
    });
    // console.log(files);
  });
}

console.log(files,"-------------")

    
// Get the token from the request headers
const tokenWithBearer = req.headers.authorization;
let token;

if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
    // Extract the token without the 'Bearer ' prefix
    token = tokenWithBearer.slice(7);
}

if (!token) {
    return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
}
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    // Check if the user has the "boutique" role
    if (decoded.role !== "admin") {
        // If the user does not have the "boutique" role, return an error
        return res.status(403).json(Response({ statusCode: 403, message: 'You are not authorized to create products.',status:'faield' }));
    }
        // Convert the category name to lowercase
        const lowercaseName = name.toLowerCase();
        

        // Check if the lowercase category name already exists
        const existingCategory = await Category.findOne({ name:lowercaseName });
        if (existingCategory) {
            return res.status(400).json(Response({ statusCode: 400, message: 'Category already exists', status: "Failed" }));
        }

        // Create the category
        const newCategory = await Category.create({name:lowercaseName,categoryImage:files[0],sizeType:sizeType})

        res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Category created successfully", data: { category: newCategory } }));
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json(Response({ statusCode: 500, message: error.message, status: "Failed" }));
    }
};

// get createCategory
const getallCategory=async(_req,res,_next)=>{
    try {
        const allCatagory=await Category.find()

         res.status(200).json(Response({ statusCode: 200, status: "ok", message: "Product created successfully",data:{allCatagory} }));
    } catch (error) {
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" })); return res.status(500).json("new error")
        
    }

}

// catagory with product image 

const getallCategoryWithProductImage = async (_req, res, _next) => {
    try {
        // Query all products
        const allProducts = await Category.find()

        res.status(200).json(Response({statusCode:200,status:"ok",message:"your category fetched",data:{allProducts}}));
    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
}




module.exports={
    createCategory,
    getallCategory,
    getallCategoryWithProductImage
    

}