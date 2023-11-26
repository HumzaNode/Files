const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://TheKing:T9JdwPcHUXf23CMb@cluster0.eoscmwf.mongodb.net/data?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Mongoose Schema
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
  // Fetch all items from the database
  const items = await Item.find();
  res.render('index', { items });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/create', async (req, res) => {
  // Create a new item in the database
  const newItem = new Item({
    name: req.body.name,
    description: req.body.description,
  });

  await newItem.save();
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  // Fetch the item with the given ID
  const item = await Item.findById(req.params.id);
  res.render('edit', { item });
});

app.post('/update/:id', async (req, res) => {
  // Update the item with the given ID
  await Item.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
  });

  res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
  // Delete the item with the given ID
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
