const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Item = require('./models/Item.js');



const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// DB Connection
//process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect("mongodb://127.0.0.1:27017/lost")
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

// Routes

app.get('/report', (req, res) => {
  res.render('report');
});

app.get('/:id', (req, res) => {
  res.render('found');
  
});

app.post('/submit-item', async (req, res) => {
  const { name, description } = req.body;

  try {
      // Find item that matches all fields
      const matchedItem = await Item.findOne({ name, description });
      
      if (matchedItem) {
        let contactNumber = matchedItem.contact;
          // Delete the matched item
          await Item.deleteOne({ _id: matchedItem._id });

          // Flash message or send JSON response
          res.render("matched" ,{contactNumber})
      } else {
          res.render("notMatch")
      }
  } catch (err) {
      console.error(err);
      res.status(500).send({ status: 'error', message: 'Server error' });
  }
});

app.post('/report', async (req, res) => {
  const { name, description, contact, type,image } = req.body;
  const newItem = new Item({ name, description, contact, type,image });
  await newItem.save();
  res.redirect('/');
});

app.get('/', async (req, res) => {
  const items = await Item.find().sort({ date: -1 });
  res.render('index', { items });
});


app.get('/search', async (req, res) => {
  const name = req.query.name;
  console.log(req.query);
   console.log(name);
  try {
      const matchedItems = await Item.find({
          name: { $regex: new RegExp(name, 'i') } // case-insensitive search
      });
      console.log(matchedItems)
      res.render("index", {item:matchedItems});
  } catch (err) {
      console.error(err);
      res.status(500).send('Error while searching');
  }
});



//process.env.PORT ${process.env.PORT}
app.listen(3000, () => console.log(`Server running on port `));