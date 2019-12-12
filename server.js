const express 		    = require('express');
const app		 		= express();
const bodyParser 		= require('body-parser');
const methodOverride 	= require('method-override');
const unirest 			= require('unirest');
const cors 				= require('cors');
const session 			= require('express-session');
const http				= require('http').Server(app);
const io				= require('socket.io')(http);

require('dotenv').config();
require('./db/db');

const PORT = process.env.PORT;


app.use(session({
	secret:process.env.SESSION_SECRET,
	resave:false,
	saveUninitialized:false
}));

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const corsOptions = {
	origin:process.env.FRONT_END_URL,
	credentials:true,
	optionSuccessStatus:200
}

app.use(cors(corsOptions));

const userController = require('./controllers/userController');
const diaryController = require('./controllers/diaryController');
const messageController = require('./controllers/messageController');

app.use('/auth', userController);
app.use('/routine', diaryController);
app.use('/message', messageController);

io.on('connection', (socket) => {
	console.log('user connected socket');
	socket.on('messages', (message) => {
		console.log('messages received from client');
		io.sockets.emit('messages', message)
		console.log('message sent to client')
	});
	socket.on('conversations', (conversation) => {
		io.sockets.emit('conversations', conversation)
	});
	socket.on('disconnect', () => {
		console.log('user disconnected socket')
	})
})

http.listen(PORT, () => {
	console.log('listening on port')
});