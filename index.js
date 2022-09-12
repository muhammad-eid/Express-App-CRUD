const express = require('express')
const hbs = require('hbs')
const path = require('path')
const fs = require('fs')

const PORT = 3001
const DB = 'data.json'
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.static('./frontend/public'))
app.set('view engine', 'hbs')
app.set('views', './frontend/views')
hbs.registerPartials('./frontend/layouts')

app.get('/', (req, res)=>{
    let AllUsers
    try {AllUsers = JSON.parse(fs.readFileSync(DB))}
    catch(e) {AllUsers = []}
    res.render('home', {
        PageTitle:'Home',
        slides:["/images/a.jpg", "/images/b.jpg", "/images/c.jpg"],
        AllUsers
    })
})

app.get('/add', (req, res)=>{
    res.render('add', {
        PageTitle:'Add User'
    })
})
app.post('/add', (req,res)=>{
    user = {id:Date.now() , ...req.body}
    let AllUsers
    try{
        AllUsers = JSON.parse(fs.readFileSync(DB))
    }
    catch(e){
        AllUsers = []
    }
    AllUsers.push(user)
    fs.writeFileSync(DB, JSON.stringify(AllUsers))
    res.redirect('/')
})

app.get('/edit/:id', (req, res)=>{
    let user
    try{user = JSON.parse(fs.readFileSync(DB)).find(user=> user.id==req.params.id)}
    catch(e){user = undefined}
    res.render('edit', {
        PageTitle:'Edit User',
        user
    })
})

app.post('/edit/:id', (req,res)=>{
    let AllUsers
    try{
        AllUsers = JSON.parse(fs.readFileSync(DB))
        AllUsers[AllUsers.findIndex(user=>user.id==req.params.id)] = {id:req.params.id , ...req.body}
    }
    catch(e){
        console.log(e)
    }
    console.log(AllUsers)
    fs.writeFileSync(DB, JSON.stringify(AllUsers))
    res.redirect('/')
})

app.get('/single/:id', (req, res)=>{
    let user
    // console.log(JSON.parse(fs.readFileSync(DB)).find((user=> user.id==req.query.id)))
    try{user= JSON.parse(fs.readFileSync(DB)).find((user=> user.id==req.params.id))}
    catch(e){user = undefined}
    res.render('single', {
        PageTitle:'Show User',
        user 
    })
})

app.get('*', (req, res)=>{
    res.render('err404', {
        PageTitle:'Not Found'
    })
})
app.listen(PORT, ()=>{
    console.log('Start app at http://localhost:'+PORT)
})
