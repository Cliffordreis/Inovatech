const express = require("express");  
const app = express();
app.locals.carrinho = "seu carrinho está vazio";
const smartphones = require('./models/smartphones')
const session = require('express-session');
const Users = require('./models/users');
app.locals.Vnick;
app.locals.status = false;

app.use(session({
    secret: 'chave-secreta',
    resave: false,
    saveUninitialized: true
}));

//handlebars
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
app.engine('handlebars', expressHandlebars.engine({
    defaultLayout: "main",
    partialsDir: __dirname + "/views/partials/",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        eq: function(a, b) {
            return a === b;
        },
        formatCurrency: function(value) {
            return parseFloat(value).toFixed(2); // Formata para 2 casas decimais
        }
    }
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

// criando carrinho
// Defina o middleware para tornar o carrinho acessível em todas as rotas
app.use((req, res, next) => {
    // Se o carrinho ainda não existir na sessão, inicialize-o
    if (!req.session.carrinho) {
        req.session.carrinho = [];
        req.session.totalv = 0;     
    }
    // Define o carrinho atual no res.locals para acesso global nos templates
    res.locals.carrinho = req.session.carrinho;
    res.locals.total = req.session.carrinho.length;
    res.locals.totalv = req.session.totalv;
    next();
});

app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));



//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rotas
app.get('/', function(req, res){
    // const carrinho = req.session.carrinho || [];
    res.render('home',);
})

app.get('/login', function(req,res){
    res.render('login',);
})

app.get('/cadastro', function(req,res){
    res.render('cadastro');
})

//carrinho (add/delete)
// Middleware para tornar o carrinho e totalv acessíveis globalmente
app.use((req, res, next) => {
    // Inicializa o carrinho e totalv se não existirem
    if (!req.session.carrinho) {
        req.session.carrinho = [];
        req.session.totalv = 0; // Inicializa o totalv na sessão
    }

    // Passa o totalv para o template via res.locals
    res.locals.carrinho = req.session.carrinho;
    res.locals.totalv = req.session.totalv;
    next();
});

// Rota para adicionar item ao carrinho
// Middleware para tornar o carrinho e totalv acessíveis globalmente
app.use((req, res, next) => {
    if (!req.session.carrinho) {
        req.session.carrinho = [];
        req.locals.totalv = 0; // Inicializa totalv como número
    }

    next();
});

// Rota para adicionar item ao carrinho
app.post('/addcarrinho/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const item = await smartphones.findByPk(id);
        if (!item) {
            return res.status(404).send("Item não encontrado.");
        }

        // Verifica se o item já existe no carrinho
        const itemIndex = req.session.carrinho.findIndex(carrinhoItem => carrinhoItem.id === item.id);

        if (itemIndex >= 0) {
            // Incrementa a quantidade do item existente
            req.session.carrinho[itemIndex].quantidade += 1;
        } else {
            // Adiciona o item novo com quantidade inicial de 1
            req.session.carrinho.push({
                id: item.id,
                name: item.namecell,
                specs: item.specs,
                valor: item.valor, // Converte valor em número
                quantidade: 1,
            });
        }

        // Atualiza o totalv com o valor numérico do item
        req.session.totalv += item.valor;
        res.locals.totalv = req.session.totalv;

        console.log("Item adicionado ao carrinho:", req.session.carrinho);
        console.log("Valor total do carrinho (totalv):", req.session.totalv);

        res.redirect('/');
    } catch (error) {
        console.error("Erro ao adicionar item ao carrinho:", error);
        res.status(500).send("Erro no servidor: " + error.message);
    }
});




app.post('/diminuir/:id', (req, res) => {
    const itemId = req.params.id; // Corrigido para req.params.id
    const itemIndex = req.session.carrinho.findIndex(carrinhoItem => carrinhoItem.id == itemId);

    if (itemIndex >= 0) { // Verifica se o item existe no carrinho
        if (req.session.carrinho[itemIndex].quantidade > 1) {
            // Decrementa a quantidade do item
            req.session.carrinho[itemIndex].quantidade -= 1;
            req.session.totalv -= req.session.carrinho[itemIndex].valor;
        
            // Atualiza o totalv no res.locals para uso global
            res.locals.totalv = req.session.totalv;
        } else {
            // Remove o item do carrinho se a quantidade é 1

            req.session.totalv -= req.session.carrinho[itemIndex].valor;
        
        // Atualiza o totalv no res.locals para uso global
            res.locals.totalv = req.session.totalv;
            req.session.carrinho.splice(itemIndex, 1);
        }
    
    }

    res.redirect('back'); // Retorna para a página anterior
});

app.post('/aumentar/:id', (req, res) => {
    const itemId = req.params.id; // Corrigido para req.params.id
    const itemIndex = req.session.carrinho.findIndex(carrinhoItem => carrinhoItem.id == itemId);

    if (itemIndex >= 0) { // Verifica se o item existe no carrinho
            req.session.carrinho[itemIndex].quantidade += 1;
        // Adiciona o valor do item ao totalv com base no valor unitário do item
            req.session.totalv += req.session.carrinho[itemIndex].valor;
        
        // Atualiza o totalv no res.locals para uso global
            res.locals.totalv = req.session.totalv;
    }
    res.redirect('back'); // Retorna para a página anterior
});

app.get('/carrinho', function(req,res){
    res.render('carrinho');
})

//add user
app.post('/adduser', function(req, res) {
    const {email, senha, confirmacao} = req.body
    if (senha !== confirmacao){
        return res.render('cadastro', {error: "as senhas não coincidem!"})
    }
    Users.findOne({
        where: {email : email}
    }).then(function(resultado){
        if(resultado){
        res.render('cadastro', {error: "esse email já possue registro no sistema!"})
        }else {
            Users.create({
                nome : req.body.nome,
                sobrenome : req.body.sobrenome,
                nick : req.body.nome + " " + req.body.sobrenome,
                email : req.body.email,
                senha: req.body.senha
            }).then(function (){
                res.redirect('/login')
            }).catch(function(error){
                res.send("houve um erro "+error)
            })
            }
    })
    
})

//login
app.post('/entrando', (req, res) => {
    const email = req.body.email
    const senha = req.body.senha

    Users.findOne({
        where : {email : email,
                senha : senha}
    }).then(function (user) {
        if(user){
        app.locals.Vnick = user.nick;
        app.locals.status = true;
        res.redirect('/')
        }else{
            res.render('login', {error: 'usuario e senha não encontrados!'})
        }
    }).catch(function(error){
        res.render("erro "+ error)
    })
})

//logout
app.get('/logout', (req, res) => {
    app.locals.status = false;
    app.locals.Vnick = null;
    res.redirect('/')
})

app.listen(3000, function(){
    console.log("servidor ativo na url: http://localhost:3000")
});