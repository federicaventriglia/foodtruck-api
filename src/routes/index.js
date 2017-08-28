import express from 'express';
import config from '../config'; //../ to get back in the directory and then to config
import middleware from '../middleware';
import initializeDb from '../db';
import foodtruck from '../controller/foodtruck'; //we're not gonna use an index.js file this time
import account from '../controller/account'; 

let router = express();

//connect to the database
initializeDb(db => {
    //we're connected to the db 
    //internal middleware
    router.use(middleware({config, db }));
    
    //api routes v1 (/v1)
    router.use('/foodtruck', foodtruck({config, db})); // this is gonna be a controller, to handle the restaurant part of the API
    
    router.use('/account', account({config, db }));
    
});

export default router;