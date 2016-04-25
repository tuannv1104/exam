
var mongoose = require('mongoose');

module.exports = mongoose.model('message',{
	from: String,
	to: String,
	content: String,
	status: String
});