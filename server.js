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

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const userController = require('./controllers/userController');
app.use('/auth', userController);

app.listen(PORT, () => {
	console.log('listening on port')
});