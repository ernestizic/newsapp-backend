const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken'); 
const auth = require('../middleware/auth') 




exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            count: users.length,
            users: users
        })
    } catch (err) {
        return res.status(500).json({
            sucess: false,
            error: 'Server error'
        })
    }
}


exports.register = async (req, res) => {
    const found = await User.findOne({email: req.body.email})
    try{
        if (found) {
            return res.status(400).json({
                success: false,
                msg: 'User already exist with this email'
            })
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User ({
                fullName: req.body.fullName,
                email: req.body.email,
                password: hashedPassword
            })
            user.save()
                .then( user => {
                    jwt.sign(
                        {id: user.id}, 
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: 3600 },
                        (err, token)=> {
                            if (err) throw err
        
                            return res.status(201).json({
                                token,
                                success: true,
                                data: user
                            })
                        }
                    )
                })
        }

    } catch (err) {
        return res.status(500).json({
            sucess: false,
            error: 'Server error'
        })
    }
}



exports.auth = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    try{
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'User not found'
            })
        }
        // Validate password
        if (await bcrypt.compare(req.body.password, user.password)){
            jwt.sign(
                {id: user.id}, 
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "2 days" },
                (err, token)=> {
                    if (err) throw err

                    return res.status(201).json({
                        token,
                        success: true,
                        data: user
                    })
                }
            )
        } else {
            return res.status(400).json({
                success: false,
                msg: "Invalid credentials"
            })
        }
        

    } catch (err) {
        return res.status(500).json({
            sucess: false,
            error: 'Server error'
        })
    }
};


exports.getUserData = (req, res) => {
    auth(req, res, (err) => {
        User.findById(req.user.id)
            .select('-password')
            .then(user => {
                res.status(200).json({
                    data: user
                })
            })
    })
}
