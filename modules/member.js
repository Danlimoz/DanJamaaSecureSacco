// modules/member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    idNumber: { type: String, required: true },
    kraPin: { type: String, required: true },
    phoneLine: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    occupation: { type: String, required: true },
    dob: { type: Date, required: true },
    county: { type: String, required: true },
    constituency: { type: String, required: true },
    ward: { type: String, required: true },
    physicalAddress: { type: String, required: true },
    gender: { type: String, required: true },
    position: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;