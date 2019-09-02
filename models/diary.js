const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
	date: String,
	title: String,
	about: String
})

const Diary = mongoose.model('Diary', diarySchema);

module.exports = Diary;