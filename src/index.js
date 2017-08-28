// main application file
import http from 'http'; // it's gonna actually let us create a server
import express from 'express';
import bodyParser from 'body-parser'; // to parse our json
import mongoose from 'mongoose'; // interact with MongoDB in an elegant way
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy; 

import config from './config';
import routes from './routes';

let app = express();
app.server = http.createServer(app);

// middleware
// parse application/json
app.use(bodyParser.json({
   limit: config.bodyLimit 
})); //limit the size of data that can be passed in

// passport config
app.use(passport.initialize());
let Account = require('./model/account');
passport.use(new LocalStrategy({
    // map the username field to email 
    usernameField: 'email',
    passwordField: 'password'
},
    Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// api routes v1
app.use('/v1', routes);

app.server.listen(config.port); // we don't have config setup YET 

console.log(`Started on port ${app.server.address().port}`);

export default app; // exporting this app as default so if anybody imports our app.js they're gonna get the app file 
