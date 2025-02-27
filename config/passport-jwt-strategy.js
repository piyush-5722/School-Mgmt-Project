const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'RNW'
}

const faopts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'FRNW'
}

const stopts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'SRNW'
}

const Admin = require('../model/adminmodel');
const Faculty = require('../model/facultymodel');
const Student = require('../model/studentmodel');

passport.use(new JwtStrategy(opts, async (payload, done) => {
        let checkadminData = await Admin.findOne({ email: payload.newregister.email });
        if (checkadminData) {
            return done(null, checkadminData)
        } else {
            return done(null, false)
        }
    }
))

passport.use('faculty',new JwtStrategy(faopts, async (payload, done) => {
        let checkadminData = await Faculty.findOne({ email: payload.Ft.email });
        if (checkadminData) {
            return done(null, checkadminData)
        } else {
            return done(null, false)
        }
    }
))

passport.use('student',new JwtStrategy(stopts, async (payload, done) => {
    let checkadminData = await Student.findOne({ email: payload.Studentdata.email });
    if (checkadminData) {
        return done(null, checkadminData)
    } else {
        return done(null, false)
    }
}
))

passport.serializeUser((user,done)=>{
    return done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    let adminDatade = await Admin.findById(id);
    if (adminDatade) {
        return done(null,adminDatade)
    } else {
        return done(null,false)
    }
})

passport.deserializeUser(async(id,done)=>{
    let facultyDatade = await Faculty.findById(id);
    if (facultyDatade) {
        return done(null,facultyDatade)
    } else {
        return done(null,false)
    }
})

passport.deserializeUser(async(id,done)=>{
    let studentDatade = await Student.findById(id);
    if (studentDatade) {
        return done(null,studentDatade)
    } else {
        return done(null,false)
    }
})

module.exports = passport