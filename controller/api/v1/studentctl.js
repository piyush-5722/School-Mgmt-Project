const Faculty = require('../../../model/facultymodel');
const Student = require('../../../model/studentmodel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer"); 

module.exports.studentlogin = async(req,res)=>{
    try {
        let checkAdmin = await Student.findOne({email:req.body.email});
        if (checkAdmin) {
            let checkpassword = await bcrypt.compare(req.body.password, checkAdmin.password);
            if (checkpassword) {
                checkAdmin.password = undefined;
                let FacultyToken = await jwt.sign({Studentdata:checkAdmin},'SRNW',{expiresIn:'1d'})
                return res.status(200).json({msg:'student login successfully',data:FacultyToken})
            } else {
                return res.status(200).json({msg:'student login not successfully'})
            }
        } else {
            return res.status(200).json({msg:'email already exist'})
        }
    } catch (err) {
        return res.status(400).json({msg:'request not success',errors:err})
    }
}

module.exports.studentprofile = async(req,res)=>{
    try {
        return res.status(200).json({msg:'student user information',Studentdata:req.user});
    }
    catch(err){
        return res.status(400).json({msg:'request not success',errors:err})
    }
}


module.exports.editstudentprofile = async(req,res)=>{
    try {
        let checkfacultyid = await Student.findById(req.params.id);
        if (checkfacultyid) {
            let updatestudent = await Student.findByIdAndUpdate(req.params.id,req.body);
            if (updatestudent) {
                let updateprofile = await Student.findById(req.params.id);
                return res.status(200).json({msg:'student profile update successfully',data:updateprofile})
            } else {
                return res.status(200).json({msg:'update not successfully'})
            }
        }
        else{
            return res.status(200).json({msg:'student data not found'})
        }
    }
    catch(err){
        return res.status(400).json({msg:'request not success',errors:err})
    }
}

module.exports.changestudentpassword = async(req,res)=>{
    try {
        let checkcurrentpassword = await bcrypt.compare(req.body.currentpassword,req.user.password);
        if (checkcurrentpassword) {
          if (req.body.currentpassword!=req.body.newpass) {
              if (req.body.newpass==req.body.confirmpassword) {
                  req.body.password = await bcrypt.hash(req.body.newpass, 10);
                  let updatepassword = await Student.findByIdAndUpdate(req.user._id,req.body);
                  if (updatepassword) {
                      return res.status(200).json({msg:'password update successfully',data:updatepassword}) 
                  } else {
                      return res.status(200).json({msg:'password update not successfully'})
                  }
              } else {
                  return res.status(200).json({msg:'new password and cofirm password not match'})
              }
              
          } else {
              return res.status(200).json({msg:'current password and new password not match'})
          }
        } else {
          return res.status(200).json({msg:'current password not match'})
        }
    }
    catch(err){
        return res.status(400).json({msg:'request not success',errors:err})
    }
}