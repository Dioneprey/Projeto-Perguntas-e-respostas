const Sequelize = require('sequelize')
const connection = require('./database')

// MODEL!
// Criando a tabela do database
const Pergunta = connection.define('perguntas', {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})
// Mandando o Model para o database
Pergunta.sync({force: false}).then(() => {})

// Necessário criar um modulo para criar row de uma table
module.exports = Pergunta