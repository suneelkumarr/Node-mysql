require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

port = process.env.PORT || 5000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true}))

app.get('/healthcheck',(req, res) =>{
    res.json({
        message: 'server is good'
    })
})

app.use('/' , require('./Routes/customer.routes'))



app.listen(port,(req, res)=>{
     console.log(`Server is running on ${port}`);
     console.log(`http://localhost:${port}`);
})