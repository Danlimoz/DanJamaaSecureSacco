// models/Product.js
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    loanName: { type: String, required: true },
    loanInterest: { type: Number, required: true },
    loanDuration: { type: Number, required: true },
    processingFee: { type: Number, required: true },
    maxLimit: { type: Number, required: true },
    minLimit: { type: Number, required: true },
    guarantor: { type: String, required: true },
    savings: { type: Number, required: true },
    applicationMethod: { type: String, required: true },
    description: { type: String, required: true }
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

// Export the Product model
module.exports = Product;