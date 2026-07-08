require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwt_secret = process.env.JWT_SECRET

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Token missing"
        });
    }

    const token = authHeader.split(" ")[1]
    try{
        const decoded = jwt.verify(token,jwt_secret);
        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(404).json({
                message: "User not found!"
            })
        };

        req.user = user;
        next();

    } catch(err){
        res.status(401).json({
            message: err.message
        })
    }
}

module.exports = verifyToken;