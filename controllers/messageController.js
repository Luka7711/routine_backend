const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');

router.post('/texting/:user/:convoid', async(req, res, next) => {
	try{
		const shipper	= await User.findOne({username: req.body.shipper});
		const receiver	= await User.findOne({username: req.body.receiver});

		if(req.params.convoid === "null") {
			
			let newConvo = await Conversation.create(req.body);
			newConvo.participants.push(shipper._id, receiver._id);
			newConvo.save();

			shipper.conversation.push(newConvo._id);
			shipper.save()
			
			receiver.conversation.push(newConvo._id);
			receiver.save();

			const messageData = {
				conversationId: newConvo._id,
				text: req.body.text,
				author: shipper,
				timestamp: req.body.timestamp
			}

			const message = await Message.create(messageData);
			message.save();

			res.json({
				status:200,
				convoID:newConvo._id
			})
		}
		else{
			const messageData = {
				conversationId: req.params.convoid,
				text: req.body.text,
				author: shipper,
				timestamp:req.body.timestamp
			}

			const message = await Message.create(messageData);
			message.save();

			res.json({
				status:200,
				convoID: req.params.convoid
			})
		}
	}catch(err){
		console.log("something went wrong")
	}
});

			//zack <=> dina
router.get('/receive-id/text/:author/:receiver', async(req, res, next)=>{
	// when contact is chosen, and ready to start to chat
	// find conversation where participants 1 and 2 has conversation 
	try{
		const shipper 	= await User.findOne({username:req.params.author});
		const receiver 	= await User.findOne({username:req.params.receiver});
		const convo 	= await Conversation.findOne({"participants": {"$all" : [shipper.id, receiver.id]} }, async(err, conversation) => {
			if(conversation === null){
				res.json({
					status:200,
					conversationId:null
				})
			}
			else{
				// if conversation exist pull all messages between two contacts
				// send messages to FRONT END
				res.json({
					status:200,
					conversationId:conversation._id
				})
			
			}
		})
	}catch(err){
		console.log(err, "###########");
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

router.get('/contact-list/:user', async(req, res, next) => {
	try{
		let loggedUser = await User.findOne({username:req.params.user});
		
		let dataSend 		= []; // data about user contacts ({name, [messages]}) 
		let message 		= []; // 
		let mixedIDS 		= []; //
		let uniqContacts 	= []; //
		let contactName 	= [];
		let convObj;
		// iterate conversation objects and store 
		// participants in global array

		let storeContIds = async() => {
			convObj = await Conversation.find({"participants":loggedUser._id});
			return new Promise(resolve => {
					// console.log(contactName, "from fun");
					if(convObj == null) res.json({status:202, data:null})
			
					else{
						convObj.map(async(ids, i) => {
							await mixedIDS.push(ids.participants);
						})	
					}
				resolve()
				//1 loop each element as id
				mixedIDS.map(async(elem, i) => {
					elem.map(async(mycontactID, k) => {
						//storing user contacts id to uniq array
						if(mycontactID.toString() !== loggedUser._id.toString()) {
							let idToString = await mycontactID.toString();
							await uniqContacts.push(idToString);
						}
					})
				})
			})
		}//storeNames

		let storeContNames = async() => {
			await storeContIds();
			let contact;
			let message;
			let i=0;

			class ContactList{
				constructor(username, messages, url){
					this.username = username;
					this.messages = messages;
					this.url 	  = url;
				}
			}

			while(i<uniqContacts.length){
				message = await Message.find({"conversationId":convObj[i]._id});
				contact = await User.findOne({"_id": uniqContacts[i]}, async(err, foundUser) => {
					try{
						if(err){
							console.log("too fast")
						}
						else{
							try{
								await contactName.push(foundUser.username);
								await dataSend.push(new ContactList(foundUser.username, message, "http://localhost:9000/auth/user-avatar/"+foundUser.username))
								i++;
							}
							catch(err){
							}
						}
					}	
					catch(err){
						console.log(err)
					}
				})
			}
			return contactName
		}

		storeContNames().then(async()=> {
			
			res.json({
				status:200,
				data:dataSend
			})
		})
	}catch(err){
		console.log(err)
	}
})

module.exports = router;