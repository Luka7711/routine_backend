const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.post('/register', async(req, res, next) => {
	
	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	const userDbEntry = {};
	
	userDbEntry.username = req.body.username;
	userDbEntry.password = passwordHash;

	try{
		const newUser = await User.create(userDbEntry);
		req.session.logged = true;
		req.session.userDbId = newUser._id;

		res.json({
			status:200,
			data: newUser,
			message:`Welcome to Daily Routine ${newUser.username}`
		})

		console.log(`${newUser} added to database`)

	}catch(err){
		next(err)
		res.json({
			status:404,
			message:'Something went wrong!'
		})
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
		const user = await User.findOne({'username':req.body.username});

		if(user){
			if(bcrypt.compareSync(req.body.password, user.password) === true){
				req.session.logged === true;
				req.session.userDbId === user._id
			}
		}
	}
})

module.exports = router;