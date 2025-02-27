const express = require('express');

const routes = express.Router();

const facultyctl = require('../../../../controller/api/v1/facultyctl')

const passport = require('passport');

routes.post('/facultylogin',facultyctl.facultylogin)

routes.get('/facultyprofile',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failfacultyauth'}),facultyctl.facultyprofile)

routes.put('/editfacultyprofile/:id',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failfacultyauth'}),facultyctl.editfacultyprofile)

routes.post('/changefacultypassword',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failfacultyauth'}),facultyctl.changefacultypassword)

routes.post('/studentgister',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failfacultyauth'}),facultyctl.studentgister)

routes.get('/facultylogout',async(req,res)=>{
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

routes.get('/failfacultyauth',async(req,res)=>{
    try {
        return res.status(401).json({msg:'invalid token'})
    } catch (err) {
        return res.status(400).json({msg:'request not success',errors:err})
    }
})

module.exports = routes