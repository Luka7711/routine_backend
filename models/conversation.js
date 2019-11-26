const mongoose = require('mongoose');
const User = require('./user');

const conversationSchema = new mongoose.Schema({
	participants:[{type:Schema.Types.Objectid, ref:'User'}]
})

const Converstaion =  mongoose.model('Converstaion', conversationSchema);

module.exports = Conversation;