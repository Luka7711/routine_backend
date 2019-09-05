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

module.exports = router;