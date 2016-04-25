
var mongoose = require('mongoose');

module.exports = mongoose.model('friendship',{
	meemail: String,
	fremail: String
});