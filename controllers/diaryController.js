const express 	= require('express');
const router 	= express.Router();
const unirest	= require('unirest');
const Diary 	= require('../models/diary');
const User 		= require('../models/user');

router.get('/diary/:username', async(req, res, next) => {
	try{
		await User.findOne({'username': req.params.username}).populate('diaryStory').exec(function(err, stories) {
			if(err){
				res.json({
					status:404,
					message:'User doesnt have a stories yet'
				})
			}else{
				res.json({
					status:200,
					message:'Success user stories found',
					data:stories
				})
			}
		});

	}catch(err){
		next(err);
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

		await user.diaryStory.unshift(newDiary._id);
		await user.save();

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
});


router.get('/my-diary/:id', async(req, res, next) => {
	try{
		const diaryStory = await Diary.findById(req.params.id, (err, foundDiary) => {
			if(err){
				res.json({
					status:404,
					message: `Diary with id ${req.params.id} not found`
				})
				console.log('erroooooor')
			}else{
				console.log('success works fine')
				res.json({
					status:200,
					data: foundDiary,
					message: 'Success diary is found'
				})
			}
		})
	}catch(err){
		console.log(err);
	}
});

router.put('/my-diary/edit/:id', async(req, res, next) => {
	try{
		const diaryStory = await Diary.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, result){
			if(err){
				res.json({
					status:404,
					message:'Failed to update'
				})
			}else{
				res.json({
					status:200,
					message:'Successfully updated'
				})
			}
		})
	}catch(err){
		res.json({
			message:'Fail to update, catch error'
		})
	}
})

router.delete('/my-diary/delete/:id/:username', async(req, res, next) => {
	try{
		const user = await User.findOne({username:req.params.username});
		const diary = await Diary.findById(req.params.id);
		user.diaryStory.remove(diary._id);
		user.save(function(err){
			if(err){
				res.json({
					status:404,
					message:'Failed to save'
				})
			}else{
				res.json({
					status:200,
					message:'Success data deleted'
				})
			}
		});

	}catch(err){
		next(err)
	}
});

router.get('/quotes', async(req, res, next) => {
	try{
		let req = unirest('GET', "https://150000-quotes.p.rapidapi.com/random");
		req.headers({
			"x-rapidapi-host": "150000-quotes.p.rapidapi.com",
			"x-rapidapi-key": "20a16b11demsh01d177a853c4fa0p1f60c3jsnf03f5408c9ed"
		});
		req.end(function (response) {
			if (res.error) throw new Error(res.error);
				res.json({
					status:200,
					data: response.body,
					message: 'Success, data is mined'
				})
		});
	}catch(err){
		next(err);
		res.json({
			message:'Failed to access quotes'
		})
	}
});



module.exports = router;