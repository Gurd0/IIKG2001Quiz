const fs = require('fs');
const fetch = require('node-fetch');
const express = require('express')
const util = require('util');


const app = express()
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res) => {
  return res.redirect('/quiz');
  
})
app.get('/quiz', (req, res) => {
  res.render('quiz')
})


app.get('/api/iikg2001',  async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let size = 5
  let domain = "all"

  switch(req.query.domain) {
    case "1":
      domain = "domain1"
      break;
    case "2":
      domain = "domain2"
      break;
    case "3":
      domain = "domain3"
      break;
    
  }
  if (req.query.size == "all"){
    size = 999
  }else{
    let inputSize = parseInt(req.query.size)
    //Check if size is a number
    if(inputSize != null && req.query.size > 0){ 
        size = inputSize
    }
  }
    

  parseJson(size, domain).then(list =>  {   
    res.send(list)
   }).catch(err => {
    console.log(err.message); // 
  });
})
// Shuffle array



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const readFile = util.promisify(fs.readFile);

async function readJson(){
  return readFile('public/iikg2001Book.json') 
}

async function parseJson(size, domain){
  let rawJson
  let json = []
  let combinedJson = []
  let questions
  await readJson().then(async data=> {
   rawJson = JSON.parse(data)
  

    //TODO hent domene
    switch(domain) {
      case "domain1":
        json = rawJson.domains[0]
        break;
      case "domain2":
        json = rawJson.domains[1]
        break;
      case "domain3":
        json = rawJson.domains[2]
        break;
      case "all":
        for (var i = 0; i < rawJson.domains.length; i++) {
          json.push(rawJson.domains[i])
        } 
        
        //console.log(json)
        break;
        
        
      default:
        //TODO 
    }
    
    if(Array.isArray(json)){
      json.forEach(element => {
        questions = Object.values(element)
        questions.forEach(ques => {
            //console.log(ques)
            combinedJson.push(ques)
        })
      });
    }else{
      questions = Object.values(json)
        questions.forEach(ques => {
            //console.log(ques)
            combinedJson.push(ques)
        })
    }
    //Shuffel the array and slice 
  })
  return shuffleArray(combinedJson).then(it => it.slice(0, size)).then(result =>{ return result})
}

async function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array
  }
  