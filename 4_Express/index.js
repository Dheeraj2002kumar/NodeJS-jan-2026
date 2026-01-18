const express = require("express")
const http = require('http')

const app = express()

app.get('/', (req, res) => {
    res.send(`Hello from Home page`)
})

app.get('/about', (req, res) => {
    res.send(`Hello from About page. Hey ${req.query.name}`)
})

app.listen(8082, ()=> {
    console.log(`Server running http://localhost:8082`)
})