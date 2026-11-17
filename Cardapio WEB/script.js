const API_URL = 'https://adsunifor-production.up.railway.app';

let listaCategorias = [];
let listaPratos = [];

function carregarCategoriasEmCards() {
    fetch(`${API_URL}/categorias`)
    .then(res => res.json())
    .then(dados => {
        const grid = document.getElementById("gridCategorias");
        if (!grid) return;
        
        grid.innerHTML = "";

        if (dados.length === 0) {
            grid.innerHTML = "<p>Nenhuma categoria cadastrada.</p>";
            return;
        }

        dados.forEach(cat => {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card-categoria";

            const htmlDescricao = (cat.descricao_categoria && cat.descricao_categoria.trim() !== "") 
                ? ` - ${cat.descricao_categoria}` 
                : "";

            cardDiv.innerHTML = `
                <div class="card-info">
                    <h3>${cat.nome_categoria}</h3>
                    <p>${cat.total_pratos || 0} prato(s)${htmlDescricao}</p>
                </div>
                <div class="card-divider"></div>
                <div class="card-acoes">
                    <button class="btn-ver" onclick="verPratos(${cat.id_categoria})">Ver pratos</button>
                    <button class="btn-editar" onclick="abrirCadastroPrato(${cat.id_categoria})">Adicionar pratos a Categoria</button>
                    <button class="btn-excluir" onclick="deletarCategoria(${cat.id_categoria})">Excluir Categoria</button>
                </div>
            `;

            grid.appendChild(cardDiv);
        });
    })
    .catch(err => console.error("Erro ao carregar os cards de categorias:", err));
}

function deletarCategoria(id_categoria) {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
        return;
    }

    fetch(`${API_URL}/categorias/${id_categoria}`, {
        method: 'DELETE'
    })
    .then(async res => {
        const resposta = await res.json();
        
        if (!res.ok) {
            alert(resposta.erro || "Não foi possível excluir a categoria.");
            return;
        }

        alert(resposta.mensagem || "Categoria excluída com sucesso!");
        carregarCategoriasEmCards();
    })
    .catch(err => {
        console.error("Erro na requisição de exclusão:", err);
        alert("Erro de conexão com o servidor.");
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('gridCategorias');
    if (grid && typeof carregarCategoriasEmCards === 'function') {
        carregarCategoriasEmCards();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const toast = document.getElementById('toastSucesso');
    const textoToast = document.getElementById('textoToast');

    if (toast && textoToast) {
        let mensagem = "";

        if (urlParams.get('sucesso') === 'true') {
            mensagem = "Categoria cadastrada com sucesso!";
        } else if (urlParams.get('pratoCadastrado') === 'true') {
            mensagem = "Prato cadastrado com sucesso!";
        }

        if (mensagem !== "") {
            textoToast.textContent = mensagem;
            toast.classList.add('mostrar');
            
            setTimeout(() => {
                toast.classList.remove('mostrar');
            }, 3500);

            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
});

function abrirCadastroCategoria() {
    window.location.href = "adicionar_categoria.html";
}

function abrirCadastroPrato(id_categoria) {
    window.location.href = `adicionar_pratos.html?categoria_id=${id_categoria}`;
}

function verPratos(id_categoria) {
    console.log("Ver pratos da categoria:", id_categoria);
}