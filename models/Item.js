const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  contact: String,
  type: String, // 'Lost' or 'Found'
  image:String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', ItemSchema);