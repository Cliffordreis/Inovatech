const express = require("express");  
const app = express();

//handlebars
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
app.engine('handlebars', expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        eq: function(a, b) {
            return a === b;
        }
    }
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rotas
app.get('/', function(req, res){
    res.render('home');
})

app.listen(3000, function(){
    console.log("servidor ativo na url: http://localhost:3000")
});