const jwt = require('jsonwebtoken'); 


const auth =(req, res, next)=> {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({ msg: "No token. Authorization denied"})

    // Verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        //Add user from payload
        req.user = user
        next()
    })

}

module.exports = auth 




