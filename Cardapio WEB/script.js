let listaCategorias = [];
let listaPratos = [];
// Função para Listar todas as categorias em card na pagina de Development
function carregarCategoriasEmCards() {
    fetch('https://adsunifor-production.up.railway.app/categorias')
    .then(res => res.json())
    .then(dados => {
        const grid = document.getElementById("gridCategorias");
        grid.innerHTML = "";

        if (dados.length === 0) {
            grid.innerHTML = "<p>Nenhuma categoria cadastrada.</p>";
            return;
        }

        dados.forEach(cat => {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card-categoria";

            // Se a categoria tiver descrição, criamos a tag <p>. Se não tiver, fica uma string vazia ("")
            const htmlDescricao = (cat.descricao_categoria && cat.descricao_categoria.trim() !== "") 
                ? ` - ${cat.descricao_categoria}` 
                : "";

            cardDiv.innerHTML = `
                <div class="card-info">
                    <h3>${cat.nome_categoria}</h3>
                    <p>${cat.total_pratos} prato(s)${htmlDescricao}</p>
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

// função para Remover uma categoria.
function deletarCategoria(id_categoria) {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
        return;
    }

    fetch(`https://adsunifor-production.up.railway.app/categorias/${id_categoria}`, {
        method: 'DELETE'
    })
    .then(async res => {
        const resposta = await res.json();
        
        if (!res.ok) {
            // Exibe a mensagem de erro amigável vinda do backend (ex: "ainda existem pratos...")
            alert(resposta.erro || "Não foi possível excluir a categoria.");
            return;
        }

        // Sucesso na exclusão
        alert(resposta.mensagem || "Categoria excluída com sucesso!");
        
        // Recarrega os cards na tela para sumir com a categoria excluída
        carregarCategoriasEmCards();
    })
    .catch(err => {
        console.error("Erro na requisição de exclusão:", err);
        alert("Erro de conexão com o servidor.");
    });
}

// Mensagem q é exibida na tela
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

// Funções para Redirecionar para a pagina correspondente.
function abrirCadastroCategoria() {
    window.location.href = "Adicionar_categoria.html";
}

function abrirCadastroPrato(id_categoria) {
    window.location.href = `Adicionar_pratos.html?categoria_id=${id_categoria}`;
}

function deletarCategoria(id) {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    fetch(`https://adsunifor-production.up.railway.app/categorias/${id}`, {
        method: 'DELETE'
    })
    .then(async res => {
        const resposta = await res.json();

        if (!res.ok) {
            // Exibe a mensagem amigável enviada pelo backend (ex: "Não é possível excluir...")
            alert(resposta.erro || "Erro ao excluir.");
            return;
        }

        // Sucesso: Recarrega os cards
        window.location.reload();
    })
    .catch(err => {
        console.error("Erro na requisição:", err);
        alert("Erro de conexão com o servidor.");
    });
}