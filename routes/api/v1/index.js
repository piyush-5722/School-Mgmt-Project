const express = require('express');

const routes = express.Router();

const adminctl = require('../../../controller/api/v1/adminctl');

const passport = require('passport');

routes.post('/adminregister',adminctl.adminregister);

routes.post('/adminlogin',adminctl.adminlogin);

routes.get('/adminprofile',passport.authenticate('jwt',{failureRedirect:'/api/adminfaillogin'}),adminctl.adminprofile)

routes.put('/editadminprofile/:id',passport.authenticate('jwt',{failureRedirect:'/api/adminfaillogin'}),adminctl.editadminprofile)

routes.post('/changepassword',passport.authenticate('jwt',{failureRedirect:'/api/adminfaillogin'}),adminctl.changepassword)

routes.post('/sendemail',passport.authenticate('jwt',{failureRedirect:'/api/adminfaillogin'}),adminctl.sendemail)

routes.post('/forgetpassword',passport.authenticate('jwt',{failureRedirect:'/api/adminfaillogin'}),adminctl.forgetpassword)

routes.post('/facultyregister',passport.authenticate('jwt',{failureRedirect:'/api/adminfaillogin'}),adminctl.facultyregister)

routes.get('/adminlogout',async(req,res)=>{
    try {
        req.session.destroy((err)=>{
            if(err){
                return res.status(400).json({msg:'something wrong'})
            }
            else{
                return res.status(200).json({msg:'go to admin login'})
            }
        })
    } catch (err) {
        return res.status(400).json({msg:'request not success',errors:err})
    }
})

routes.get('/adminfaillogin',async(req,res)=>{
    try {
        return res.status(401).json({msg:'invalid token'})
    } catch (err) {
        return res.status(400).json({msg:'request not success',errors:err})
    }
})

module.exports = routes