const mongoose = require('mongoose');
const User = require('./user');

const conversationSchema = new Schema({
	participants:[{type:Schema.Types.Objectid, ref:'User'}]
})

const Converstaion = new mongoose.model('Converstaion', conversationSchema);

module.exports = Conversation;