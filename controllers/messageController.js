const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/:author/:receiver', async(req, res, next)=>{
	console.log('successful chat')
})


module.exports = router;