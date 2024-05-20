const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Order schema
const OrderSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items:{
        type:Object,
        required:true
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['neworder', 'inprogress', 'assigned', 'delivered', 'cancelled'], 
        default: 'neworder' 
    },
    deliveryAddress: { 
        type: String, 
        required: true 
    },
    paymentMethod: { 
        tranjectionId:{type:String,required:true},
        methodName:{type:String,required:true} 
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Define a virtual field to calculate the total quantity of items in the order
OrderSchema.virtual('totalItems').get(function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Define a pre-save hook to update the 'updatedAt' field
OrderSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Create the Order model
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
