// database.js
const mongoose = require('mongoose');

// Connect to MongoDB (replace with your connection string)
const mongoURI = 'mongodb://127.0.0.1:27017/your_database'; // Use IPv4 address

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model for members
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

// Use `mongoose.models` to check if the model already exists
const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

// Function to fetch members from the database
async function getMembersFromDatabase() {
    try {
        const members = await Member.find(); // Fetch all members
        return members;
    } catch (error) {
        throw new Error('Error fetching members: ' + error.message);
    }
}

module.exports = { getMembersFromDatabase };