const jwt = require('jsonwebtoken')
const blacklistModel = require('../models/blacklist')

//validate the user is logged in or not by verifying the token
async function authMiddleware(req, res, next) {
    const token = req.cookies.token

    // Check if the token is present
    if(!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const isBlacklisted = await blacklistModel.findOne({token})
    if(isBlacklisted) {
       return res.status(401).json({
            message: "Unauthorized"
        })
    }

    // Verify the token
    try{
        const decoded = jwt.verify(token, process.env.SECRET)
        // Token already contains userId and username,
        // encoded when the JWT was created during login/register.
        // decoded = { userId: "123", username: "crypto700" }
        // If valid, it creates a JWT payload like { userId: user._id, username: user.username } 
        // (where user._id is the MongoDB ObjectId).
        // This payload is signed and sent as a cookie to the client.
        req.user = decoded
        next()
    } catch(err) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }

}

module.exports = authMiddleware;