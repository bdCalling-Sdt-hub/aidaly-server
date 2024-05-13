const mongoose = require('mongoose');

// Define the category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  
  categoryImage: { type: Object, required: true},

  
  
});

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
