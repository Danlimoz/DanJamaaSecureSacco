// models/Loan.js
const mongoose = require('mongoose');

// Define the loan schema
const loanSchema = new mongoose.Schema({
    idNumber: { type: String, required: true },
    loanProduct: { type: String, required: true },
    principalAmount: { type: Number, required: true },
    interestAmount: { type: Number, required: true },
    processingFee: { type: Number, required: true },
    loanAmount: { type: Number, required: true },
    loanDuration: { type: Number, required: true },
    guarantor1: { type: String, required: true },
    guarantor2: { type: String, required: true },
    activeLoans: { type: String, required: true },
    loanStatus: { type: String, required: true },
    dateDisbursed: { type: Date, required: true },
    firstInstallmentDate: { type: Date, required: true },
    officerNotes: { type: String },
    applicationForm: { type: String } // Path to the uploaded file
});

// Create the Loan model
const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan; // Export the model for use in other files