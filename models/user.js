const mongoose = require('mongoose');
const Diary = require('./diary');

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
	}]
})

const User = new mongoose.model('User', userSchema);

module.exports = User;