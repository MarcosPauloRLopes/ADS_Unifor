let listaCategorias = [];
let listaPratos = [];

function carregarCategorias() {
    fetch('http://localhost:3000/categorias')
        .then(res => res.json())
        .then(dados => {
            const containerCategorias = document.getElementById("listaCategorias");
            containerCategorias.innerHTML = "";

            if (dados.length === 0) {
                containerCategorias.innerHTML = "<p>Nenhuma categoria cadastrada.</p>";
                return;
            }

            dados.forEach(cat => {
                const divCat = document.createElement("div");
                divCat.className = "item-categoria";
                
                divCat.innerHTML = `
                    <span>${cat.nome_categoria}</span>
                    <button type="button" onclick="deletarCategoria(${cat.id_categoria})" style="background-color: #d9534f; color: white; border: none; padding: 4px 8px;">remover</button>
                `;

                containerCategorias.appendChild(divCat);
            });
        })
        .catch(err => console.log("Erro ao carregar categorias:", err));
}

function cadastrarCategoria(event) {
    event.preventDefault();

    const nomeInput = document.getElementById("nomeCategoria");
    const nome_categoria = nomeInput.value;

    if (!nome_categoria.trim()) {
        alert("Por favor, digite o nome da categoria.");
        return;
    }

    fetch('http://localhost:3000/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_categoria })
    })
    .then(async res => {
        const resposta = await res.json();
        
        if (!res.ok) {
            alert(resposta.erro || "Erro ao cadastrar categoria.");
            return;
        }

        // Redireciona para a página principal informando que deu sucesso
        window.location.href = "Development.html?sucesso=true";
    })
    .catch(err => {
        console.error("Erro na requisição:", err);
        alert("Erro de conexão com o servidor.");
    });
}

function carregarCategoriasEmCards() {
    fetch('http://localhost:3000/categorias')
        .then(res => res.json())
        .then(dados => {
            const grid = document.getElementById("gridCategorias");
            grid.innerHTML = ""; // Limpa a grid antes de preencher

            if (dados.length === 0) {
                grid.innerHTML = "<p>Nenhuma categoria cadastrada no momento.</p>";
                return;
            }

            dados.forEach(cat => {
                const cardDiv = document.createElement("div");
                cardDiv.className = "card-categoria";

                // Monta o layout HTML idêntico ao modelo da imagem
                cardDiv.innerHTML = `
                    <div class="card-info">
                        <h3>${cat.nome_categoria}</h3>
                        <p>Gerenciamento de itens</p>
                    </div>
                    <div class="card-divider"></div>
                    <div class="card-acoes">
                        <button class="btn-ver" onclick="verPratosDaCategoria(${cat.id_categoria})">Ver pratos</button>
                        <button class="btn-editar" onclick="editarCategoria(${cat.id_categoria})">Editar</button>
                        <button class="btn-excluir" onclick="deletarCategoria(${cat.id_categoria})">Excluir</button>
                    </div>
                `;

                grid.appendChild(cardDiv);
            });
        })
        .catch(err => console.error("Erro ao carregar os cards de categorias:", err));
}

// Executa a função assim que a página é aberta
window.addEventListener('DOMContentLoaded', () => {
    carregarCategoriasEmCards();

    // Verifica se a URL contém o parâmetro de sucesso
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sucesso') === 'true') {
        const toast = document.getElementById('toastSucesso');
        if (toast) {
            toast.classList.add('mostrar');

            // Remove a mensagem da tela após 3.5 segundos
            setTimeout(() => {
                toast.classList.remove('mostrar');
            }, 3500);
        }
    }
});
// Função temporária para o botão de Nova Categoria (você pode redirecionar para a tela de cadastro ou abrir um modal)
function abrirCadastroCategoria() {
    window.location.href = "Adicionar_categoria.html";
}