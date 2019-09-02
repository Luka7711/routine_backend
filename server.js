const express 			= require('express');
const app		 		= express();
const bodyParser 		= require('body-parser');
const methodOverride 	= require('method-override');
const cors 				= require('cors');
const session 			= require('require-session');

require('dotenv').config();
require('./db/db');

const PORT = process.env.PORT;

app.use(session({
	secret:process.env.SESSION_SECRET,
	resave:false,
	saveUninitilized:false
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

