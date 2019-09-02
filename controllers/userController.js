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
	}
})

module.exports = router;