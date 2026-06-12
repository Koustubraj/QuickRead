const express = require('express')
const app = express()
const router = require('./router')
const cors = require('cors')

app.use(cors({
    origin:'*'
}))

app.use(express.json())

app.use('/',router)

app.get('/',(req,res)=>{
    console.log('got hit')
    res.send("hello there mother fucker!")
})



app.listen(3001,()=>console.log('listening at 3000'))