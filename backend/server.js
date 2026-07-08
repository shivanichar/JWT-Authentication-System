const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")

const jwt_secret = "mySuperSecretKey"


const app = express();

const verifyToken = require('./middleware/authMiddleware');

const user = {
    id: 1,
    name: 'Shivani',
    email: "shivani@gmail.com",
    password: "hello"
} 

app.use(cors())
app.use(express.json())


app.get('/', (req,res) => {
    res.send('Backend running!!!')
})

app.post('/login', (req,res) => {
    console.log("Login hit")
    const {email, password} = req.body
    if(email == user.email && password == user.password){
        const token = jwt.sign(
            {
                id: user.id,
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
    }
    res.status(401).json({
        message: 'Invalid credentials!'
    })
})


app.get("/profile", verifyToken, (req,res) => {
    res.json({
        message: "Welcome to the Profile",
        user: {
            id: '1',
            name: 'Shivani',
            email: 'shivani@gmail.com'
        }
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