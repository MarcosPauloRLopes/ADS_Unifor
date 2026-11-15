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
            // Código de erro do MySQL para entrada duplicada (ER_DUP_ENTRY)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ erro: "Esta categoria já existe!" });
            }
            console.error("Erro ao cadastrar categoria:", err);
            return res.status(500).json({ erro: "Erro ao cadastrar categoria." });
        }
        res.status(201).json({ mensagem: "Categoria cadastrada com sucesso!" });
    });
});

// Rota para Remover uma categoria existente.
app.delete('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM categoria WHERE id_categoria = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            // Código do MySQL para violação de chave estrangeira (ER_ROW_IS_REFERENCED_2)
            if (err.errno === 1451 || err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({ 
                    erro: "Não é possível excluir esta categoria pois ainda existem pratos cadastrados nela!" 
                });
            }
            console.error("Erro ao deletar categoria:", err);
            return res.status(500).json({ erro: "Erro ao deletar categoria." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        }

        res.json({ mensagem: "Categoria excluída com sucesso!" });
    });
});

// Rota para Modificar uma categoria existente.
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

/*  
    ////////////////////////////
    ROTAS DA ENTIDADE DE PRATOS.
    ////////////////////////////
*/ 

// Rota para Lista todos os pratos com a sua categoria.
app.get('/pratos', (req, res) => {
    const query = `
        SELECT 
            p.id_prato, 
            p.nome_prato, 
            p.desc_prato, 
            p.preco_prato,
            p.disponivel, 
            p.id_categoria_prato,
            c.nome_categoria 
        FROM pratos p
        INNER JOIN categoria c ON p.id_categoria_prato = c.id_categoria
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar pratos:", err);
            return res.status(500).json({ erro: "Erro ao buscar pratos." });
        }
        res.json(results);
    });
});

//Rota para Adicionar um novo prato a uma categoria existente.
app.post('/pratos', (req, res) => {
    const { id_prato, nome_prato, desc_prato, preco_prato, id_categoria_prato } = req.body;
    const query = 'INSERT INTO pratos (id_prato, nome_prato, desc_prato, preco_prato, id_categoria_prato) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [id_prato, nome_prato, desc_prato, preco_prato, id_categoria_prato], (err, result) => {
        if (err) {
            console.error("Erro ao adicionar prato:", err);
            return res.status(500).json({ erro: "Erro ao cadastrar prato." });
        }
        res.status(201).json({ mensagem: 'Prato cadastrado com sucesso!' });
    });
});

// Rota para Remover um prato de uma categoria existente.
app.delete('/pratos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pratos WHERE id_prato = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Erro ao remover prato:", err);
            return res.status(500).json({ erro: "Erro ao remover prato." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Prato não encontrado.' });
        }
        res.json({ mensagem: 'Prato removido com sucesso!' });
    });
});

// Rota para Modificar um prato existente.
app.put('/pratos/:id', (req, res) => {
    const { id } = req.params;
    const { nome_prato, desc_prato, preco_prato, id_categoria_prato } = req.body;
    const query = 'UPDATE pratos SET nome_prato = ?, desc_prato = ?, preco_prato = ?, id_categoria_prato = ? WHERE id_prato = ?';

    db.query(query, [nome_prato, desc_prato, preco_prato, id_categoria_prato, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar prato:", err);
            return res.status(500).json({ erro: "Erro ao atualizar prato." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Prato não encontrado.' });
        }
        res.json({ mensagem: 'Prato atualizado com sucesso!' });
    });
});

// Rota para Modificar a disponibilidade de um prato.
app.patch('/pratos/:id/disponibilidade', (req, res) => {
    const { id } = req.params;
    const { disponivel } = req.body; // Espera receber { disponivel: 0 } ou { disponivel: 1 }

    const query = 'UPDATE pratos SET disponivel = ? WHERE id_prato = ?';

    db.query(query, [disponivel, id], (err, result) => {
        if (err) {
            console.error("Erro ao alterar disponibilidade:", err);
            return res.status(500).json({ erro: "Erro ao atualizar disponibilidade." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Prato não encontrado.' });
        }

        res.json({ mensagem: 'Disponibilidade atualizada com sucesso!' });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000 (http://localhost:3000)');
});