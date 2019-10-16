const mongoose = require('mongoose');
const User = require('./user');

const messageSchema = new mongoose.Schema({
	message:{type:String, required:false},
	time:{type:String, required:true}
});

const Message = new mongoose.model('Message', messageSchema);

module.exports = Message