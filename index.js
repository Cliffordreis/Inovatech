const express = require("express");  
const app = express();
app.locals.carrinho = "seu carrinho está vazio";
const smartphones = require('./models/smartphones')
const session = require('express-session');

app.use(session({
    secret: 'chave-secreta', // Use uma chave segura
    resave: false,
    saveUninitialized: true
}));

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
    const carrinho = req.session.carrinho || [];
    res.render('home', {carrinho});
})

app.get('/login', function(req,res){
    res.render('login');
})

app.get('/cadastro', function(req,res){
    res.render('cadastro');
})

//carrinho
app.post('/addcarrinho/:id', async (req, res) => {
    const id = req.body.cod; // Pega o id do item enviado pelo formulário

    // Busca o item no banco de dados pelo ID
    try {
        const item = await smartphones.findByPk(id);
        if (!item) {
            return res.status(404).send("Item não encontrado.");
        }

        // Adiciona o item ao carrinho na sessão
        if (!req.session.carrinho) {
            req.session.carrinho = [];
        }

        req.session.carrinho.push({
            id: item.id,
            name: item.namecell,
            specs: item.specs,
            valor: item.valor,
        });

        console.log("Item adicionado ao carrinho:", req.session.carrinho); // Verificação

        res.redirect('/'); // Redireciona para a página inicial ou para o carrinho
    } catch (error) {
        console.error("Erro ao adicionar item ao carrinho:", error); // Log do erro
        res.status(500).send("Erro no servidor: " + error.message); // Envia mensagem de erro
    }
});

app.post('/apagaritem/:id', (req, res) => {
    const itemId = req.params.id; // Captura a ID da URL
    req.session.carrinho = (req.session.carrinho || []).filter(item => item.id != itemId);
    res.redirect('/')
});



// app.post('/addcarrinho/:id', function(req,res){
//     res.send(req.body.cod);
// })

app.listen(3000, function(){
    console.log("servidor ativo na url: http://localhost:3000")
});