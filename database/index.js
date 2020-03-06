var mongoose = require('mongoose');
var questionSchema = require('./schema.js');
var mongoURI = 'mongodb://localhost/hackbox';

var db = mongoose.connect(mongoURI, { useNewUrlParser: true })
.then(() => console.log('connected to mongoDB'));


var Question = mongoose.model('Question', questionSchema);


module.exports = Question;
