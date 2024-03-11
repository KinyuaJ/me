const express = require ('express')
const bcrypt = require('bcrypt')
const path = require('path')
const mongooose =  require ('mongoose')
const collection = require("./config")

const app = express()

app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static("public"))

app.get('/', (req,res)=>{
    res.render("login")
})

app.get('/signup', (req,res)=>{
    res.render("signup")
})

app.post('/signup', async(req,res)=>{
    const data = {
        name: req.body.name,
        password: req.body.password
    }
const existingUser = await collection.findOne({name: data.name})
if (existingUser) {
    res.send("Username already exists")
}else{
    const hashedPassword = await bcrypt.hash(data.password, 10)
    data.password = hashedPassword
const userdata = await collection.insertMany(data)
    console.log(userdata);}
})

app.post('/login', async(req,res)=>{
    try{
        const check = await collection.findOne({name: req.body.username})
        if (!check) {
            res.render("username can't be found") 
        } 
        const isPassmatch = await bcrypt.compare(req.body.password, check.password )
        if (isPassmatch) {
            res.render("home")
        }else{
            res.send('Wrong password')
        }
    }catch{
        res.send('wrong details')
    }
})


app.listen(5000, ()=>{
    console.log("Server started at port 5000");
})



