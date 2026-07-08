require("dotenv").config()
const connectDb = require("./config/db")
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const jwt_secret = process.env.JWT_SECRET


connectDb();

const app = express();

const verifyToken = require('./middleware/authMiddleware');

const User = require("./models/User")


app.use(cors())
app.use(express.json())


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
            return res.status(400).jason({
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

    
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name
            },
            jwt_secret,
            {
                expiresIn: "1m"
            }
        )
        return res.json({
            message: 'Login successful',
            token
        })
    } catch(err){
        return res.status(500).json({
            message: "internal Server Error!"
        })
    }
    
})


app.get("/profile", verifyToken, (req,res) => {
    res.json({
        message: "Welcome to the Profile",
        user: req.user
    })
})

app.get("/dashboard", verifyToken, (req,res) => {
    res.json({
        message: "Welcome to the Dashboard",
        user: req.user
    })
})

app.get("/settings", verifyToken, (req,res) => {
    res.json({
        message: "Welcome to the Settings",
        user: req.user
    })
})

app.listen(3005, ()=>{
    console.log('Server running on port 3001!')
})