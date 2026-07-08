const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const jwt_secret = "mySuperSecretKey"


const app = express();

const verifyToken = require('./middleware/authMiddleware');

const users = [];

// const user = {
//     id: 1,
//     name: 'Shivani',
//     email: "shivani@gmail.com",
//     password: "hello"
// } 

app.use(cors())
app.use(express.json())


app.get('/', (req,res) => {
    res.send('Backend running!!!')
})

app.post("/register", async (req, res) => {
    const {name, password, email} = req.body;

    const existingUser = users.find(
        user => users.email === email
    );

    if(existingUser){
        return res.status(409).json({
            message: "user already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword
    }
    users.push(newUser);

    console.log(users)

    return res.status(201).json({
        message: "User Registered successfully"
    })
})

app.post('/login', (req,res) => {
    console.log("Login hit")
    const {email, password} = req.body

    const user = users.find(
        user => user.email === email
    );

    if(!user){
        return res.status(401).json({
           message: 'Invalid credentials!'
        })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!password){
        return res.status(401).json({
            message: 'Invalid credentials!'
        })
    }

    
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