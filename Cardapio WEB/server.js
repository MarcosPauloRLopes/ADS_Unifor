const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Cardapio_WEB'
});


db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL com sucesso!');
});

/*  
    ///////////////////////////////
    ROTAS DA ENTIDADE DE CATEGORIA.
    ////////////////////////////////
*/

// Rota para Listar todas as categorias.
app.get('/categorias', (req, res) => {
    const query = 'SELECT * FROM categoria';

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar categorias:", err);
            return res.status(500).json({ erro: "Erro ao buscar categorias." });
        }
        res.json(results);
    });
});

// Rota para Adicionar uma nova categoria.
app.post('/categorias', (req, res) => {
    const { nome_categoria } = req.body;
    const query = 'INSERT INTO categoria (nome_categoria) VALUES (?)';

    db.query(query, [nome_categoria], (err, result) => {
        if (err) {
            console.error("Erro ao adicionar categoria:", err);
            return res.status(500).json({ erro: "Erro ao cadastrar categoria." });
        }
        res.status(201).json({ 
            mensagem: 'Categoria cadastrada com sucesso!', 
            id_categoria: result.insertId 
        });
    });
});

// Rota para REmover uma categoria existente.
app.delete('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM categoria WHERE id_categoria = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Erro ao remover categoria:", err);
            // Geralmente ocorre erro se houver pratos vinculados (Foreign Key)
            return res.status(500).json({ erro: "Não é possível excluir esta categoria pois existem pratos vinculados a ela." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
        }
        res.json({ mensagem: 'Categoria removida com sucesso!' });
    });
});

// Rota para modificar uma categoria existente.
app.put('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const { nome_categoria } = req.body;
    const query = 'UPDATE categoria SET nome_categoria = ? WHERE id_categoria = ?';

    db.query(query, [nome_categoria, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar categoria:", err);
            return res.status(500).json({ erro: "Erro ao atualizar categoria." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
        }
        res.json({ mensagem: 'Categoria atualizada com sucesso!' });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000 (http://localhost:3000)');
});