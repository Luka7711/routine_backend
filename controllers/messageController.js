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

		res.json({
			status:200,
			message: message
		})
	}catch(err){
		console.log("something went wrong")
		console.log(err)
	}
		
})

			//zack <=> dina
router.post('/:author/:receiver', async(req, res, next)=>{
	// when contact is chosen, and ready to start to chat
	// find conversation where participants 1 and 2 has conversation 
	try{
		const shipper = await User.findOne({username:req.params.author});
		const receiver = await User.findOne({username:req.params.receiver});
		await Conversation.find({"participants": {"$all" : [shipper.id, receiver.id]} }, async(err, conversation) => {
			console.log(conversation)
			if(conversation.length == 0){
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
				conversationData: conversation[0]._id,
				mess: "exist chat"
				})
			}
		})
	}catch(err){
		console.log(err)
	}

});


router.get('/my-conversation/:convoid', async(req, res, next) => {
	try{
		await Message.find({"conversationId" : req.params.convoid}, (err, message) =>{
			if(err){
				res.json({
					status:404,
					sms: "Something went wrong"
				})
			}else{
				res.json({
					status:200,
					messages: message,
					sms: "Success"
				})
			}
		})
	}catch(err){
		next(err)
	}
})



module.exports = router;