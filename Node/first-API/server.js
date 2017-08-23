var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


var ingredents = [
    {
        "id":"232KAK",
        "text":"Eggs"
    },
    {
        "id":"asd",
        "text":"Milk"
        
    },
    {
        "id":"dsss",
        "text":"Bacon"
    },
    {
        "id":"73dhs",
        "text":"Frogs Legs"
    }
];




app.get('/ingredents', function(request, response) {
    response.send(ingredents);
    
})

app.get('/funions', function(request, response){
    response.send('My First funions!');
})

app.post('/ingredents', function(request, response){
    
    var ingredient = request.body;
    if (!ingredient || ingredient.text === "") {
        response.status(500).send({error:"Your ingredient must have text"});
    } else {
        ingredents.push(ingredient);
        response.status(200).send(ingredient);
    }
})

app.put('/ingredents/:ingredentId', function(request,response) { 
    var ingredentId = request.params.ingredentId;
    var newText = request.body.text;
    if (!ingredentId || ingredentId === "" || !newText || newText === "") {
        response.status(500).send({error : "You must provide ingredient text"})
    } else {
        for (var x = 0; x < ingredents.length; x++) {
            var ing = ingredents[x];
            if (ing.id === ingredentId) {
                ingredents[x].text = newText;
                break;
            }
            
        }
        response.send(ingredents);
    }
})


app.listen(3000, function(){
    console.log('First API is running on port 3000!');
})
