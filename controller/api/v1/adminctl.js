const Admin = require('../../../model/adminmodel');
const Faculty = require('../../../model/facultymodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

module.exports.adminregister = async(req,res)=>{
    try {
        let Adminemailexist = await Admin.findOne({email:req.body.email});
        if(!Adminemailexist){
            if (req.body.password == req.body.confirmpassword) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
                let newregister = await Admin.create(req.body);
                if (newregister) {
                    return res.status(200).json({msg:'admin register successfully',data:newregister})
                } else {
                    return res.status(200).json({msg:'admin not register successfully'})
                }
            } else {
                return res.status(200).json({msg:'password and confirmpassword not match'})
            }
        }
        else{
            return res.status(200).json({msg:'email already exist'})
        }
    } catch (err) {
        return res.status(400).json({msg:'request not success',errors:err})
    }    
}

module.exports.adminlogin = async(req,res)=>{
    try {
        let checkAdmin = await Admin.findOne({email:req.body.email});
        if (checkAdmin) {
            let checkpassword = await bcrypt.compare(req.body.password, checkAdmin.password);
            if (checkpassword) {
                checkAdmin.password = undefined;
                let AdminToken = await jwt.sign({newregister:checkAdmin},'RNW',{expiresIn:'1d'})
                return res.status(200).json({msg:'admin login successfully',data:AdminToken})
            } else {
                return res.status(200).json({msg:'admin login not successfully'})
            }
        } else {
            return res.status(200).json({msg:'email already exist'})
        }
    } catch (err) {
        return res.status(400).json({msg:'request not success',errors:err})
    }
}

module.exports.adminprofile = async(req,res)=>{
    try {
        return res.status(200).json({msg:'user information',data:req.user})
    }
    catch(err){
        return res.status(400).json({msg:'request not success',errors:err})
    }
}

module.exports.editadminprofile = async(req,res)=>{
    try {
        let checkadminid = await Admin.findById(req.params.id);
        if (checkadminid) {
            let updateadmin = await Admin.findByIdAndUpdate(req.params.id,req.body);
            if (updateadmin) {
                let updateprofile = await Admin.findById(req.params.id);
                return res.status(200).json({msg:'admin profile update successfully',data:updateprofile})
            } else {
                return res.status(200).json({msg:'update not successfully'})
            }
        }
        else{
            return res.status(200).json({msg:'admin not found'})
        }
    }
    catch(err){
        return res.status(400).json({msg:'request not success',errors:err})
    }
}

module.exports.changepassword = async(req,res)=>{
    try {
      let checkcurrentpassword = await bcrypt.compare(req.body.currentpassword,req.user.password);
      if (checkcurrentpassword) {
        if (req.body.currentpassword!=req.body.newpass) {
            if (req.body.newpass==req.body.confirmpassword) {
                req.body.password = await bcrypt.hash(req.body.newpass, 10);
                let updatepassword = await Admin.findByIdAndUpdate(req.user._id,req.body);
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

module.exports.sendemail = async(req,res)=>{
    try {
        let checkemail = await Admin.findOne({email:req.body.email});
        if (checkemail) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "baraiyapiyush06@gmail.com",
                  pass: "ddviezkzehmuczxn",
                },
                tls:{
                    rejectUnauthorized:false
                }
              });
              let otp=Math.floor(Math.random()*100000);
              const info = await transporter.sendMail({
                from: '"Maddison Foo Koch 👻" baraiyapiyush06@gmail.com', // sender address
                to: 'hardikbaldaniyah@gmail.com', // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>your otp here: ${otp}</b>`, // html body
              });
              console.log('send mail')

              const data = {
                email:req.body.email,
                otp
              }
              if (info) {
                return res.status(200).json({msg:'email send successfully',data:data}) 
              } else {
                return res.status(200).json({msg:'email send successfully',data:info})
              }
        } else {
            return res.status(200).json({msg:'invalid email'})
        }
    } catch (err) {
        return res.status(400).json({msg:'request not success',errors:err})
    }
}

module.exports.forgetpassword = async(req,res)=>{
    try {
        let checkmail = await Admin.findOne({email:req.query.email});
        if (checkmail) {
            if (req.body.newpass == req.body.confirmpassword) {
                req.body.password = await bcrypt.hash(req.body.newpass,10);
                let updatepassword = await Admin.findByIdAndUpdate(checkmail._id,req.body)
                if (updatepassword) {
                    return res.status(200).json({msg:'password update successfully',data:updatepassword})
                } else {
                    return res.status(200).json({msg:'password not update successfully'}) 
                }
            } else {
                return res.status(200).json({msg:'new password and cofirm password not match'})
            }
        }else{
            return res.status(200).json({msg:'invalid email'})
        }
    } catch (err) {
        return res.status(400).json({msg:'request not success',errors:err})
    }
}

module.exports.facultyregister = async(req,res)=>{
    try {
        let Facultyemailexist = await Faculty.findOne({email:req.body.email});
        if (!Facultyemailexist) {
            var generalpass = generatePassword();
            var link  ='http://localhost:8002/api/';
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "baraiyapiyush06@gmail.com",
                  pass: "ddviezkzehmuczxn",
                },
                tls:{
                    rejectUnauthorized:false
                }
              });
              const info = await transporter.sendMail({
                from: '"Maddison Foo Koch 👻" baraiyapiyush06@gmail.com', // sender address
                to: 'hardikbaldaniyah@gmail.com', // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<h1>faculty verification</h1><p>email:${req.body.email}</p><p>passord:${generalpass}</p><p>click link here fo login:${link}</p>`, // html body
              });
              if (info) {
                let dcryptpass = await bcrypt.hash(generalpass,10);
                let facultyadd = await Faculty.create({email:req.body.email,password:dcryptpass,username:req.body.username});
                if (facultyadd) {
                    return res.status(200).json({msg:'faculty added successfully',data:facultyadd})
                }else{
                    return res.status(200).json({msg:'email not successfully'})
                }
              } else {
                return res.status(200).json({msg:'faculty not added successfully'})
              }
        }else{
            return res.status(200).json({msg:'invalid email'})
        }
    } catch (err) {
        return res.status(400).json({msg:'request not success',errors:err})
    }
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

