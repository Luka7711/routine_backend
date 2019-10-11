const express 		    = require('express');
const app		 		= express();
const bodyParser 		= require('body-parser');
const methodOverride 	= require('method-override');
const unirest 			= require('unirest');
const cors 				= require('cors');
const session 			= require('express-session');

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

app.use('/auth', userController);
app.use('/routine', diaryController);

app.listen(PORT, () => {
	console.log('listening on port')
});