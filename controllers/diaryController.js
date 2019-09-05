const express 	= require('express');
const router 	= express.Router();
const unirest	= require('unirest');
const Diary 	= require('../models/diary');
const User 		= require('../models/user');

router.get('/diary', async(req, res, next) => {
	const user = User.findById(req.session.userDbId);
	if(user){
		console.log(user)
	}else{
		console.log('user not found')
	}
})

router.post('/diary/:username', async(req, res, next) => {
	console.log('hit it');
	console.log(req.params.username)
	try{
		const user = await User.findOne({'username': req.params.username});
		const diaryData = {
			date: req.body.date,
			title: req.body.title,
			about: req.body.about
		}
		const newDiary = await Diary.create(diaryData);

		user.diaryStory.push(newDiary._id);
		user.save();

		User.findOne({"username":req.params.username}).populate('diaryStory').exec(function(err, stories){
			if(err){
				res.json({
					status:404,
					message:'There is no stories on database yet'
				})
			}else{
				res.json({
					status:200,
					data:stories,
					message:'Diary was successfully added to DB'

				})
			}
		}) 

	}catch(err){
		next(err)
	}	
})

module.exports = router;