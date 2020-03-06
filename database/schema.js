const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  prompt: String
});

module.exports = questionSchema;