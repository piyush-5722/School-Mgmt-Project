const express = require('express');

const port = 8002;

const app = express();

const db = require('./config/db');

const JwtStrategy = require('./config/passport-jwt-strategy');
const session = require('express-session');
const passport = require('passport');

app.use(express.urlencoded())
app.use(session({
    name:'RNW',
    secret:'schoolmgmt',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge: 1000 * 60 * 60 
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/api',require('./routes/api/v1'))
app.use('/api/faculty',require('./routes/api/v1/facultyroutes/facultyroutes'))
app.use('/student',require('./routes/api/v1/studentroutes/studentroutes'))

app.listen(port,function(err){
    if(err){
        return false;
    }
    console.log('server is running:'+port)
})