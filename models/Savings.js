// models/Savings.js
const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
    idNumber: { type: String, required: true },
    memberName: { type: String, required: true },
    contact: { type: String, required: true },
    servedBy: { type: String, required: true },
    amount: { type: Number, required: true },
    dateReceived: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    refNumber: { type: String, required: true }
});

const Savings = mongoose.model('Savings', savingsSchema);
module.exports = Savings;