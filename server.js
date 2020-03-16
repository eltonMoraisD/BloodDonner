const express = require('express');
const server = express()
const nunjucks = require('nunjucks')

server.use(express.static('public'))

// habilitar o body do formulario
server.use(express.urlencoded({extended:true}))

//configurar a conexao com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user:'postgres',
    password:'linuxmagicos1994',
    port:5433,
    host:'localhost',
    database: 'doe'
})

nunjucks.configure("./",{
    express: server,
    autoescape: true,
    noCache: true
})

server.get('/',(req,res)=>{
    db.query("SELECT * FROM donors", (err, result) => {
        if (err)
            return res.send('erro no banco de dados.')
        const donors = result.rows;
        res.render("index.html", { donors });
    })
})

server.post('/',(req,res)=>{
    //pegar os dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood 

    if(name == "" || email == "" || blood == ""){
       return res.send("Todos os campos sao obrigatorios")
    }

    //colocar os valores dentro do banco de dados
    const query = `INSERT INTO "donors"("name","email","blood")
                    VALUES($1, $2, $3)`

    const values = [name,email,blood]

    db.query(query,values,(err)=>{
        if(err) return res.send("Erro no banco de dados")
        return res.redirect("/")
    })
})

server.listen(3500,()=>{
    console.log('Server running!!!')
})