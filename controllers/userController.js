const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Diary = require('../models/diary');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
	destination:function(req, file, cb){
		cb(null, './uploads/')
	},
	filename:function(req, file, cb){
		cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
	}
});

//in form new attribute enctype=multipart/form-data

const upload = multer({storage:storage});

router.post('/register', upload.single('avatar'), async(req, res, next) => {

	if(User.findOne({'username':req.body.username}) === true){
		res.json({
			status:404,
			message:'Username has been taken, try another'
		})
	}else{
		const password = req.body.password;
		const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		console.log("----------")
		console.log(req.file)
		const img = fs.readFileSync(req.file.path);
		const finalImg = {
			contentType:req.file.mimetype,
			data: img
		}
		const userDbEntry = {};

		userDbEntry.username = req.body.username;
		userDbEntry.password = passwordHash;
		userDbEntry.avatar = finalImg;

		try{
			console.log(req.file.filename)
			const newUser = await User.create(userDbEntry);
			req.session.logged = true;
			req.session.userDbId = newUser._id;

			console.log('session id');
			console.log(req.session.userDbId);
			res.json({
				status:200,
				data: newUser,
				message:`Welcome to Daily Routine ${newUser.username}`
			})

		}catch(err){
			next(err)
			res.json({
				status:404,
				message:'Something went wrong!'
			})
		}

	}
})

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if(err){
			res.json({
				status:404,
				message:"not able to log out"
			})
		}else{
			res.json({
				status:200,
				message:"Thank you for visiting us"
			})
		}
	})
})

router.post('/login', async(req, res, next) => {
	try{
		console.log('username is')
		const foundUser = await User.findOne({'username':req.body.username});
		if(foundUser){
			if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
				req.session.logged === true;
				req.session.userDbId === foundUser._id
				res.json({
					status:200,
					data: foundUser,
					message: `Welcome to Routine ${foundUser.username}`
				})

			}else{
				res.json({
					status:404,
					message:'Password is incorrect, try again'
				})
			}
		}else{
			res.json({
				status:404,
				err:'Username or password is incorrect'
			})
		}
	}catch(err){
		next(err);
		res.json({
			status:404,
			message:'Not able to sign in, something went wrong'
		})
	}
});

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if(err){
			res.json({
				status: 404,
				message: 'Something went wrong!'
			})
		}else{
			res.json({
				status:200,
				message: 'Come back again'
			})
		}
	})
});

router.get('/users', async(req, res, next) => {
	try{
		const users = await User.find({}, function(err, foundUsers){
			if(err){
				res.json({
					status:404,
					message:'something went wrong'
				})
			}else{
				console.log(foundUsers)
				let currentUsers = [];
				foundUsers.map(item=>currentUsers.push(item.username));
				res.json({
					status:200,
					users:currentUsers
				})
			}
		});

	}catch(err){
		next(err);
	}
});

router.get('/users/:username', async(req, res, next) => {
	try{
		const user = await User.findOne({'username':req.params.username}).populate('diaryStory').exec(function(err, stories){
			if(err){
				res.json({
					status:404,
					message:'Error not found'
				})
			}else{
				res.json({
					status:200,
					stories:stories
				})	
			}
		})
	}catch(err){
		next(err);
	}
});

router.get('/user-avatar/:username', async(req, res, next) => {
	try{
		await User.findOne({'username':req.params.username}, function(err, foundUser){
			if(err){
				console.log(err)
			}else{
				res.set('Content-Type', foundUser.avatar.contentType);
				res.send(foundUser.avatar.data);
			}
		})
	}catch(err){
		next(err)
	}
})


module.exports = router;