require("dotenv").config()
const connectDb = require("./config/db")
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const authorize = require("./middleware/authorize")

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET


connectDb();

const app = express();

const verifyToken = require('./middleware/authMiddleware');

const User = require("./models/User")


app.use(cors())
app.use(express.json())

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name
        },
        ACCESS_SECRET,
        {
            expiresIn: "1m"
        }
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },
        REFRESH_SECRET,
        {expiresIn: "2d"}
    )
}

app.get('/', (req,res) => {
    res.send('Backend running!!!')
})

app.post("/register", async (req, res) => {
    try{
        const {name, password, email} = req.body;

        if(!email || !name || !password){
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).json({
                message: "user already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            message: "User Registered successfully"
        })
    } catch(err){
        return res.status(500).json({
            message: "Internal Server error!"
        })
    };
})

app.post('/login', async (req,res) => {
    console.log("Login hit")
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                message: "Both Email & Password is required!"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
            message: 'Invalid credentials!'
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
            return res.status(401).json({
                message: 'Invalid credentials!'
            })
        }

    
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save();

        return res.json({
            message: 'Login successful',
            accessToken,
            refreshToken
        })
    } catch(err){
        return res.status(500).json({
            message: "internal Server Error!"
        })
    }
    
})

app.get("/profile", verifyToken, async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.json({
            message: "Profile fetched successfully",
            user
        })

    }catch(err){
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

app.get("/dashboard", verifyToken, authorize("admin"), (req,res) => {
    res.json({
        message: "Welcome to the Dashboard",
        user: req.user
    })
})

app.get("/settings", verifyToken, authorize("admin", "user"), (req,res) => {
    res.json({
        message: "Welcome to the Settings",
        user: req.user
    })
})

app.post("/refresh", async (req,res) => {
    try{
        const {refreshToken} = req.body;

        if(!refreshToken){
            return res.status(401).json({
                message: "Refresh Token Missing!"
            })
        }

        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        if(user.refreshToken !== refreshToken){
            return res.status(401).json({
                message: "Refresh token invalid"
            })
        }


        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        // user.refreshToken = refreshToken;
        // await user.save();

        return res.json({
            accessToken,
            refreshToken: newRefreshToken
        })


    } catch(err){
        return res.status(401).json({
            message: "Invalid or expired access token"
        })
    }
    
})

app.post("/logout", verifyToken, async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            refreshToken: null
        }
    );

    res.json({
        message: "Logged Out!"
    })
})

app.listen(3005, ()=>{
    console.log('Server running on port 3001!')
})