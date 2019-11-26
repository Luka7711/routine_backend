const mongoose = require('mongoose');
const Diary = require('./diary');
const Message = require('./message');

const userSchema = new mongoose.Schema({
	username: {type: String, required:true},
	password: {type: String, required:true},
	avatar:{data:Buffer, contentType:String},
	diaryStory:[{
		type:mongoose.Schema.Types.ObjectId,
		ref: 'Diary'
	}],
	friends:[{
		type:mongoose.Schema.Types.ObjectId
	}],
	sentMessage:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Message'
	}]
})

const User = mongoose.model('User', userSchema);

module.exports = User;