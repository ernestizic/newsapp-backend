// const User = require('../models/userModel');
// const localStrategy = require('passport-local').Strategy;
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const bcrypt = require('bcrypt')


// const options = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.ACCESS_TOKEN_SECRET,
//     algorithms: ['RS256']
// }

// const strategy = new JwtStrategy(options, (payload, done) => {
//     User.findOne({_id: payload.sub})
//         .then(user => {
//             if (user){
//                 return done(null, user)
//             }else {
//                 return done(null, false, {message: "username or password is incorrect"})
//             }
//         })
//         .catch(err => done(err, null));
// })

// module.exports = (passport)=> {
//     passport.use(strategy);

// }



// passport.use(new localStrategy({
//     usernameField: 'user[email]'
// },
// async (email, password, done) => {
//     const user = await User.findOne({email: email})
//     if (!user) {
//         return done(null, false, {message: 'No user with that email'})
//     }
//     try {
//         if (await bcrypt.compare(password, user.password)) {
//             return done(null, user)
//         } else {
//             return done(null, false, {message: 'Password incorrect'})
//         }
//     } catch (err) {
//         return done(err)
//     }
// }))

// passport.use(new JwtStrategy({
//     jwtFromRequest: req => req.cookies.jwt,
//     secretOrKey: process.env.ACCESS_TOKEN_SECRET
// }, 
// (jwtPayload, done) => {
//     if (Date.now() > jwt.Payload.expires) {
//         return done('jwt expired');
//     }
//     return done(null, jwtPayload);
// }
// ))