const mongoose = require('mongoose');
const User = require('./user');
const Message = require('./message');

const conversationSchema = new mongoose.Schema({
	participants:[{
		type:mongoose.Schema.Types.ObjectId, 
		ref:'User'
	}]
})

const Conversation =  mongoose.model('Converstaion', conversationSchema);

module.exports = Conversation;