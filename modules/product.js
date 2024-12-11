// models/Product.js
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    loanName: { type: String, required: true }, // Name of the loan
    loanInterest: { type: Number, required: true }, // Interest rate as a number
    loanDuration: { type: Number, required: true }, // Duration of the loan in months
    processingFee: { type: Number, required: true }, // Processing fee as a number
    maxLimit: { type: Number, required: true }, // Maximum loan limit
    minLimit: { type: Number, required: true }, // Minimum loan limit
    guarantor: { type: Boolean, required: true }, // Indicates if a guarantor is required
    savings: { type: Boolean, required: true }, // Indicates if savings are required
    applicationMethod: { type: String, required: true }, // Method of application (e.g., online, physical)
    description: { type: String, required: true }, // Description of the loan product
});

// Create the model from the schema
const Product = mongoose.model('Product', productSchema);

// Export the model for use in other parts of the application
module.exports = Product;