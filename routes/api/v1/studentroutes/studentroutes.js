const express = require('express');

const routes = express.Router();

const studentctl = require('../../../../controller/api/v1/studentctl')

const passport = require('passport');

routes.post('/studentlogin',studentctl.studentlogin)

routes.get('/studentprofile',passport.authenticate('student',{failureRedirect:'student/failstudentauth'}),studentctl.studentprofile)

routes.put('/editstudentprofile/:id',passport.authenticate('student',{failureRedirect:'student/failstudentauth'}),studentctl.editstudentprofile)

routes.post('/changestudentpassword',passport.authenticate('student',{failureRedirect:'student/failstudentauth'}),studentctl.changestudentpassword)

routes.get('/studentlogout',async(req,res)=>{
    try {
        req.session.destroy((err)=>{
            if(err){
                return res.status(400).json({msg:'something wrong'})
            }
            else{
                return res.status(200).json({msg:'go to faculty login page page'})
            }
        })
    } catch (err) {
        return res.status(400).json({msg:'request not success',errors:err})
    }
})

routes.get('/failstudentauth',async(req,res)=>{
    try {
        return res.status(401).json({msg:'invalid token'})
    } catch (err) {
        return res.status(400).json({msg:'request not success',errors:err})
    }
})

module.exports = routes