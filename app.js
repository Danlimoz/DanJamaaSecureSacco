const express = require('express');
const session = require('express-session');
const path = require('path');
const userManagement = require('./modules/userManagement');
const mongoose = require('mongoose');
const Member = require('./modules/member'); // Import the Member model
const Product = require('./modules/product'); // Import the Product model
const Savings = require('./models/Savings'); 
const SavingsModel= require('./models/Savings');
const Loan = require('./modules/Loan'); //Import the Loan Modules
const multer = require('multer')
const expressLayouts = require('express-ejs-layouts'); // Import the express-ejs-layouts package
const { getMembersFromDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts); // Use the layouts middleware
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB (replace with your connection string)
const mongoURI = 'mongodb://127.0.0.1:27017/your_database'; // Use IPv4 address

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'E:/DanjamSacco/uploads'); // Ensure this path is correct
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name or generate a unique name
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Routes
app.get('/register', (req, res) => {
    res.render('register'); // Render the registration form
});

app.get('/savings', isAuthenticated, async (req, res) => {
    try {
        const savingsRecords = await Savings.find(); // Fetch all savings records from the database
        res.render('savings', { user: req.session.user, savingsRecords }); // Render the savings view
    } catch (error) {
        res.send('Error fetching savings records: ' + error.message);
    }
});

app.get('/loans', isAuthenticated, async (req, res) => {
    try {
        const loans = await Loan.find(); // Fetch all loans from the database
        res.render('loans', { user: req.session.user, loans }); // Render the loans view
    } catch (error) {
        res.send('Error fetching loans: ' + error.message);
    }
});

app.get('/members', async (req, res) => {
    try {
        const members = await getMembersFromDatabase(); // Fetch members from the database
        res.render('members', { members }); // Pass members to the view
    } catch (error) {
        console.error('Error fetching members records:', error);
        res.status(500).send('Error fetching members records');
    }
});

// Handle registration form submission
app.post('/register', async (req, res) => {
    try {
        const newUser = await userManagement.registerUser(req.body); // Assuming you have a registerUser method
        res.redirect('/login'); // Redirect to login after successful registration
    } catch (error) {
        res.send('Registration failed: ' + error.message);
    }
});

app.get('/login', (req, res) => {
    res.render('login', { page: 'login' }); // Set page variable to 'login'
});

app.post('/login', async (req, res) => {
    try {
        const user = await userManagement.login(req.body.username, req.body.password);
        req.session.user = user;
        res.redirect('/dashboard');
    } catch (error) {
        res.send('Login failed: ' + error.message);
    }
});

app.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        // Fetch all members from the database
        const members = await Member.find(); 
        
        // Render the dashboard view with user and members data
        res.render('dashboard', { user: req.session.user, members });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching members:', error.message);
        
        // Send a user-friendly error message
        res.status(500).send('Error fetching members. Please try again later.');
    }
});

app.get('/register-member', isAuthenticated, (req, res) => {
    res.render('memberRegistration');
});

// Handle member registration form submission
app.post('/register-member', isAuthenticated, async (req, res) => {
    try {
        const newMember = new Member(req.body); // Create a new member instance
        await newMember.save(); // Save the new member to the database
        res.redirect('/dashboard'); // Redirect to the dashboard after registration
    } catch (error) {
        res.send('Registration failed: ' + error.message);
    }
});

// Route to get the list of products
app.get('/products', isAuthenticated, async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        const successMessage = req.session.successMessage; // Get the success message
        req.session.successMessage = null; // Clear the message after displaying it

        res.render('products', { user: req.session.user, products, successMessage }); // Render the products view
    } catch (error) {
        res.send('Error fetching products: ' + error.message);
    }
});

app.get('/get-savings', async (req, res) => {
    try {
        const savingsRecords = await SavingsModel.find(); // Fetch all savings records
        res.status(200).json(savingsRecords); // Send the records as a response
    } catch (error) {
        console.error('Error fetching savings records:', error);
        res.status(500).json({ message: 'Error fetching savings records', error });
    }
});

// Handle product addition form submission
app.post('/add-product', isAuthenticated, async (req, res) => {
    console.log('Received product data:', req.body); // Log the received data for debugging

    // Validate required fields
    const { loanName, loanInterest, loanDuration } = req.body;
    if (!loanName || !loanInterest || !loanDuration) {
        return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }

    try {
        const newProduct = new Product(req.body); // Create a new product instance
        await newProduct.save(); // Save the new product to the database
        console.log('Product added successfully:', newProduct); // Log success
        
        // Set a success message in the session
        req.session.successMessage = 'Product added successfully!';

        // Respond with success
        res.json({ success: true, product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error); // Log the error for debugging
        res.status(500).json({ success: false, message: 'Product addition failed: ' + error.message });
    }
});

// Route for Fetching Savings Record by ID
app.get('/savings/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const savingsRecord = await SavingsModel.findById(id); // Fetch the record by ID
        if (!savingsRecord) {
            return res.status(404).json({ message: 'Savings record not found' });
        }
        res.json(savingsRecord); // Return the record as JSON
    } catch (error) {
        console.error('Error fetching savings record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for Adding New Savings Record
app.post('/add-savings', async (req, res) => {
    try {
        const { idNumber, memberName, contact, servedBy, amount, dateReceived, paymentMethod, refNumber } = req.body;

        // Validate input data
        if (!idNumber || !memberName || !contact || !servedBy || !amount || !dateReceived || !paymentMethod || !refNumber) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newSavings = new SavingsModel({
            idNumber,
            memberName,
            contact,
            servedBy,
            amount,
            dateReceived,
            paymentMethod,
            refNumber
        });

        await newSavings.save(); // Save the new record to the database
        res.status(201).json({ message: 'Savings record added successfully', savings: newSavings });
    } catch (error) {
        console.error('Error adding savings record:', error);
        res.status(500).json({ message: 'Error adding savings record', error });
    }
});

// Route for Updating Existing Savings Record
app.put('/update-savings/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body; // Get the updated data from the request body
        const updatedSavings = await SavingsModel.findByIdAndUpdate(id, updatedData, { new: true }); // Update the record
        if (!updatedSavings) {
            return res.status(404).json({ message: 'Savings record not found' });
        }
        res.json({ message: 'Savings record updated successfully', savings: updatedSavings });
    } catch (error) {
        console.error('Error updating savings record:', error);
        res.status(400).json({ message: 'Error updating savings record', error });
    }
});

// Route for handling file uploads
app.post('/apply-loan', upload.single('applicationForm'), async (req, res) => {
    console.log('Received loan application:', req.body); // Log the received form data
    console.log('Uploaded file:', req.file); // Log the uploaded file info

    // Check if the file was uploaded successfully
    if (!req.file) {
        console.error('No file uploaded.'); // Log the error
        return res.status(400).send('No file uploaded.'); // Send a 400 status code
    }

    try {
        // Create a new loan object with the received data
        const newLoan = new Loan({
            idNumber: req.body.idNumber,
            loanProduct: req.body.loanProduct,
            principalAmount: parseFloat(req.body.principalAmount) || 0, // Default to 0 if NaN
            interestAmount: parseFloat(req.body.interestAmount) || 0,
            processingFee: parseFloat(req.body.processingFee) || 0,
            loanAmount: parseFloat(req.body.loanAmount) || 0,
            loanDuration: parseInt(req.body.loanDuration, 10) || 0, // Default to 0 if NaN
            guarantor1: req.body.guarantor1,
            guarantor2: req.body.guarantor2,
            activeLoans: req.body.activeLoans,
            loanStatus: req.body.loanStatus,
            dateDisbursed: req.body.dateDisbursed ? new Date(req.body.dateDisbursed) : null, // Convert to Date object if provided
            firstInstallmentDate: req.body.firstInstallmentDate ? new Date(req.body.firstInstallmentDate) : null,
            officerNotes: req.body.officerNote, // Ensure this matches the form field
            applicationForm: req.file.path // Save the file path if uploaded
        });

        // Save the new loan to the database
        await newLoan.save(); 
        console.log('Loan application saved successfully:', newLoan); // Log success
        res.redirect('/loans'); // Redirect back to the loans page
    } catch (error) {
        console.error('Error applying for loan:', error); // Log the error for debugging
        res.status(500).send('Error applying for loan: ' + error.message); // Send a 500 status code for server errors
    }
});

    // Start the server
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});