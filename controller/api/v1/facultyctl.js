const Faculty = require('../../../model/facultymodel');
const Student = require('../../../model/studentmodel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer"); 

module.exports.facultylogin = async(req,res)=>{
    try {
        let checkAdmin = await Faculty.findOne({email:req.body.email});
        if (checkAdmin) {
            let checkpassword = await bcrypt.compare(req.body.password, checkAdmin.password);
            if (checkpassword) {
                checkAdmin.password = undefined;
                let FacultyToken = await jwt.sign({Ft:checkAdmin},'FRNW',{expiresIn:'1d'})
                return res.status(200).json({msg:'admin login successfully',data:FacultyToken})
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

module.exports.facultyprofile = async(req,res)=>{
    try {
        return res.status(200).json({msg:'faculty user information',Ft:req.user});
    }
    catch(err){
        return res.status(400).json({msg:'request not success',errors:err})
    }
}

module.exports.editfacultyprofile = async(req,res)=>{
    try {
        let checkfacultyid = await Faculty.findById(req.params.id);
        if (checkfacultyid) {
            let updatefaculty = await Faculty.findByIdAndUpdate(req.params.id,req.body);
            if (updatefaculty) {
                let updateprofile = await Faculty.findById(req.params.id);
                return res.status(200).json({msg:'faculty profile update successfully',data:updateprofile})
            } else {
                return res.status(200).json({msg:'update not successfully'})
            }
        }
        else{
            return res.status(200).json({msg:'faculty data not found'})
        }
    }
    catch(err){
        return res.status(400).json({msg:'request not success',errors:err})
    }
}

module.exports.changefacultypassword = async(req,res)=>{
    try {
        let checkcurrentpassword = await bcrypt.compare(req.body.currentpassword,req.user.password);
        if (checkcurrentpassword) {
          if (req.body.currentpassword!=req.body.newpass) {
              if (req.body.newpass==req.body.confirmpassword) {
                  req.body.password = await bcrypt.hash(req.body.newpass, 10);
                  let updatepassword = await Faculty.findByIdAndUpdate(req.user._id,req.body);
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

module.exports.studentgister = async(req,res)=>{
    try {
        let Studentemailexist = await Student.findOne({email:req.body.email});
        if (!Studentemailexist) {
            var generalpass = generatePassword();
            var link  ='http://localhost:8002/faculty/';
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
                html: `<h1>student verification</h1><p>email:${req.body.email}</p><p>passord:${generalpass}</p><p>click link here fo login:${link}</p>`, // html body
              });
              if (info) {
                let dcryptpass = await bcrypt.hash(generalpass,10);
                let studentadd = await Student.create({email:req.body.email,password:dcryptpass,username:req.body.username});
                if (studentadd) {
                    return res.status(200).json({msg:'studentdata added successfully',data:studentadd})
                }else{
                    return res.status(200).json({msg:'email not successfully'})
                }
              } else {
                return res.status(200).json({msg:'studentdata not added successfully'})
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