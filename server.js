const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const jwt = require('jwt-simple')

const User = require('./models/user')

const app = new express()

app.use(cors())
app.use(bodyParser.json())

var messages = [
    {message: 'welcome to coder dojo'},
    {message: 'glad to be here'}
]

app.get('/', (req, res) => {
    res.send('hello from server')
})

app.get('/messages', (req, res) => {
    res.send(messages)
})

app.get('/users', async (req, res) => {
    try{
        var users = await User.find({}, '-password -__v')
        res.send(users);
    }
    catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/profile/:id', async (req, res) => {
    try{
        var user = await User.findById(req.params.id, '-password -__v')
        res.send(user);
    }
    catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

app.post('/register', (req, res) => {
    var userData = req.body
    var user = new User(userData)

    user.save((err, result) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
        }
        else
            res.sendStatus(201)
    })
})

app.post('/login', async (req, res) => {
    var userData = req.body

    var user = await User.findOne({email: userData.email})

    if(!user || userData.password != user.password)
        res.status(401).send('User email or password invalid')

    var payload = {};
    var token = jwt.encode(payload, '123')

    res.status(200).send({token: token})
})

mongoose.connect('mongodb://coderdojo:iamcoder@ds121289.mlab.com:21289/template-database-mlab', (err) => {
    if(!err){
        console.log('connected to mongo')
    }
})

app.listen(8000, () => {
    console.log('server is now running on port 8000')
})