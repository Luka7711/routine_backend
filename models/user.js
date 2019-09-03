const mongoose = require('mongoose');
const Diary = require('./diary');

const userSchema = new mongoose.Schema({
	username: {type: String, require:true},
	password: {type: String, require:true},
	zodiac: {type:String, require:false},
	
	diaryStory:[{
		type:mongoose.Schema.Types.ObjectId,
		ref: 'Diary'
	}]
})

const User = new mongoose.model('User', userSchema);

module.exports = User;