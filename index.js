const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
// Import do model para o databae
const Pergunta = require("./database/Pergunta")
const Resposta = require ("./database/Resposta")
//DATABASE 

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    }) 


// Express usar o EJS como view engine
app.set('view engine','ejs')
app.use(express.static('public'))
// Body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// Rotas
app.get("/",(req, res) => { // Rota da pagina inicial
    Pergunta.findAll({ raw: true, order: [
          ['id','DESC']  // Alterando a ordem das perguntas ( ASC = Crescente || DESC = Decrescente) 
    ]}).then(perguntas => { // raw traz somentes os dados certos
        res.render("index", {
            perguntas: perguntas
        })
    }) // SELECT * ALL FROM perguntas
    
});

app.get("/perguntar",(req,res)=> {
    res.render("perguntar");
})
// Rota para receber o formulario
app.post("/salvarpergunta",(req,res)=> {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    // Criar tabela 
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => { // Para depois de criar a pergunta no DB...
        res.redirect("/") // redirecionar para o home
    })
})


app.get("/pergunta/:id",(req,res) => {
    var id = req.params.id
    Pergunta.findOne({
        where: {id: id} // onde ID é igual a VARIAVEL ID
    }).then(pergunta => {
        if(pergunta != undefined) { // Pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [ 
                    [ 'id', 'DESC'] 
                    ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })            
        }else {
            res.redirect("/")
        }
    })
})

app.post("/responder",(req,res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" +perguntaId)
    })
})

app.listen(8080, () => {console.log("App rodando!")})