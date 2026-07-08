const jwt = require("jsonwebtoken")

const jwt_secret = "mySuperSecretKey"

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Token missing"
        });
    }

    const token = authHeader.split(" ")[1]
    try{
        const decoded = jwt.verify(token,jwt_secret);
        req.user = decoded;
        next();

    } catch(err){
        res.status(401).json({
            message: err.message
        })
    }
}

module.exports = verifyToken;