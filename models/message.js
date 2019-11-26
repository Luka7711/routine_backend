const mongoose = require('mongoose');
const User = require('./user');

const messageSchema = new mongoose.Schema({
	conversationId:{
		type:mongoose.Schema.Types.ObjectId,
		required:true
	},
	body:{
		type:String,
		required:true
	},
	author:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	}
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message