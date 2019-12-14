const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');

router.post('/texting/:user/:convoid', async(req, res, next) => {
	try{
		console.log(req.body)
		const user = await User.findOne({"username": req.params.user});
		const messageData = {
			conversationId: req.params.convoid,
			text: req.body.text,
			author: user
		}
		const message = await Message.create(messageData);
		message.save();

	}catch(err){
		console.log(err)
	}
		
})

router.post('/:author/:receiver', async(req, res, next)=>{
	// when contact is chosen, and ready to start to chat
	// find conversation where author and receiver 
	try{
		const shipper = await User.findOne({username:req.params.author});
		const receiver = await User.findOne({username:req.params.receiver});
		const foundConversation = await Conversation.find({"participants": [shipper.id, receiver.id]})
		
		if(foundConversation.length === 0){
			const newConvers = await Conversation.create(req.body);
			
			newConvers.participants.push(shipper, receiver);
			newConvers.save();
			
			shipper.conversation.push(newConvers);
			shipper.save();
			
			receiver.conversation.push(newConvers);
			receiver.save();
	
			res.json({
				status:200,
				conversationData: newConvers.id
			})
		
		}else{
			res.json({
				status:200,
				conversationData: foundConversation[0].id
			})
		}
	}catch(err){
		console.log(err)
	}

});


router.get('/my-messages/:convoid', async(req, res, next) => {
	try{

	}catch(err){
		next(err)
	}
})



module.exports = router;