const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Conversation = require('../models/conversation');

router.post('/:author/:receiver', async(req, res, next)=>{
	//1. create conversation
	const shipper = await User.findOne({username:req.params.author});
	const receiver = await User.findOne({username:req.params.receiver});
	const convers = await Conversation.create(req.body);
	convers.participants.push(shipper, receiver);
	convers.save();
	shipper.conversation.push(convers);
	shipper.save();
	receiver.conversation.push(convers);
	receiver.save();
	//2. add convoID to user model
	//3. create message
})


module.exports = router;