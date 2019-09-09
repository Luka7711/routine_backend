const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.post('/register', async(req, res, next) => {

	if(User.findOne({'username':req.body.username}) === true){
		res.json({
			status:404,
			message:'Username has been taken, try another'
		})

	}else{
		const password = req.body.password;
		const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		const userDbEntry = {};

		userDbEntry.username = req.body.username;
		userDbEntry.password = passwordHash;
		userDbEntry.zodiac = req.body.zodiac

		try{
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
		console.log(req.body)
		const foundUser = await User.findOne({'username':req.body.username});
		if(foundUser){
			if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
				req.session.logged === true;
				req.session.userDbId === foundUser._id

				console.log('session id')
				console.log(req.session);

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
})

module.exports = router;