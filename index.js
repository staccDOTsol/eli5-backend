import fetch from 'node-fetch'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = new express() 
app.use(cors())
app.use(bodyParser())
app.get('/', async function (req,res){
    try {

        let maybes = await ( await fetch("https://en.wikipedia.org/w/api.php?action=opensearch&search="+req.query.search+"&limit=5&namespace=0&format=json")).json()
console.log(maybes)
    }

    catch (err){
        console.log(err)
    }
})

app.listen(process.env.PORT || 8080)


