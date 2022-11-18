// @ts-nocheck

const fetch = require('node-fetch')
const express = require( 'express')
const cors  = require('cors')
const bodyParser = require( 'body-parser')
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = new express() 
app.use(cors())
app.use(bodyParser())
app.get('/', async function (req: any,res: any){
    try {
        fs.writeFileSync(new Date().toString(), req.query.search)
console.log(req.query)
        let maybes =  ( await fetch("https://en.wikipedia.org/w/api.php?action=opensearch&search="+encodeURIComponent(req.query.search)+"&limit=5&namespace=0&format=json"))
let answer = (await maybes.json())
let ran = Math.floor(Math.random()*answer[1].length)
    let hmm = await fetch("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles="+(encodeURIComponent(answer[1][ran])))
let ahh = await hmm.json()

let prompt = "Summarize this for a five year old using very basic words:\n\n"
// @ts-ignore
prompt+=(Object.values(ahh.query.pages)[0].title + ': ' + Object.values(ahh.query.pages)[0].extract.replace('\n',' '))
console.log(prompt)
const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
        temperature: 0.9,
    max_tokens: 2400,
    top_p: 1,
    frequency_penalty: 0.1,
    presence_penalty: 0.5,
  });
  console.log(response.data.choices[0].text)
  res.json({as: JSON.stringify(answer[1]),r: (response.data.choices[0].text)})  
}

    catch (err){
        console.log(err)
    }
})

app.listen(process.env.PORT || 8080)


