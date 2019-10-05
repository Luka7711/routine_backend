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

		await user.diaryStory.push(newDiary._id);
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

router.delete('/my-diary/delete/:id', async(req, res, next) => {
	try{
		await Diary.findByIdAndDelete(req.params.id, (err, removedItem) =>{
			if(err){
				res.json({
					status:404,
					message:'Failed to delete'
				})
			}else{
				res.json({
					status:200,
					message:'Successfully deleted'
				})
			}
		})
	}catch(err){
		next(err)
	}
})

module.exports = router;