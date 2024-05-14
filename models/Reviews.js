const mongoose = require('mongoose');

// Define the schema for the review model
const reviewSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    ProductId:{type:mongoose.Schema.Types.ObjectId,ref:"Product", required:true},
    
    height: {
        type: String, // Assuming height is in centimeters
        required: true
    },
    weight: {
        type: String, // Assuming weight is in kilograms
        required: true
    },
    reviewImage: [{
        type: Object, // Assuming image URLs are strings
        required: true
    }],
    rating: {
        type: String, // Assuming stars range from 1 to 5
        required: true,
        min: 1,
        max: 5
    },
    reviews: {
        type: String // Assuming comment is optional
    }
});

// Create the review model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;


