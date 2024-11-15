const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();  // Load environment variables
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Contact Schema and Model
const contactSchema = new mongoose.Schema({
    contactName: { type: String, required: true },
    contactNumber: { type: String, required: true }
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
// Home - Display All Contacts
app.get('/contacts', async (req, res) => {
    const contacts = await Contact.find();
    res.render('index', { contacts });
});

// Form to Add a Contact
app.get('/contacts/add', (req, res) => {
    res.render('addContact');
});

// Handle Adding a Contact
app.post('/contacts/add', async (req, res) => {
    const { contactName, contactNumber } = req.body;
    await Contact.create({ contactName, contactNumber });
    res.redirect('/contacts');
});

// Form to Edit a Contact
app.get('/contacts/edit/:id', async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    res.render('editContact', { contact });
});

// Handle Updating a Contact
app.post('/contacts/edit/:id', async (req, res) => {
    const { contactName, contactNumber } = req.body;
    await Contact.findByIdAndUpdate(req.params.id, { contactName, contactNumber });
    res.redirect('/contacts');
});

// Handle Deleting a Contact
app.get('/contacts/delete/:id', async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/contacts');
});

// Start the Server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
