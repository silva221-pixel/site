    /* ================= ANIMAÇÃO AO SCROLL ================= */
    const elementos = document.querySelectorAll(
        '.hero-content, section h2, .prato-card, .form-reserva'
    );

    function animarScroll() {
        const alturaJanela = window.innerHeight * 0.85;

        elementos.forEach(el => {
            const topo = el.getBoundingClientRect().top;
            if (topo < alturaJanela) {
                el.classList.add('animar');
            }
        });
    }

    window.addEventListener('scroll', animarScroll);
    window.addEventListener('load', animarScroll);

    /* ================= CARDÁPIO POR CATEGORIA ================= */
    const botoesCategoria = document.querySelectorAll('.categorias button');
    const pratos = document.querySelectorAll('.prato-card');

    function mostrarCategoria(categoria) {
        pratos.forEach(prato => {
            if (prato.dataset.categoria === categoria) {
                prato.style.display = 'block';
            } else {
                prato.style.display = 'none';
            }
        });
    }

    // 👉 categoria padrão (primeiro botão)
    const categoriaInicial = botoesCategoria[0].dataset.categoria;
    mostrarCategoria(categoriaInicial);
    botoesCategoria[0].classList.add('ativo');

    botoesCategoria.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesCategoria.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');

            const categoria = botao.dataset.categoria;
            mostrarCategoria(categoria);
        });
    });

    /* ================= CARRINHO ================= */

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    function salvarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    function adicionarCarrinho(nome, preco, categoria, botao) {
        const item = carrinho.find(
            p => p.nome === nome && p.categoria === categoria
        );

        if (item) {
            item.qtd++;
        } else {
            carrinho.push({ nome, preco, qtd: 1, categoria });
        }

        salvarCarrinho();
        atualizarCarrinho();

        // 🔥 ANIMAÇÃO NO CARD
        const card = botao.closest('.prato-card');
        card.classList.add('added');
        setTimeout(() => card.classList.remove('added'), 400);

        // 🔥 ANIMAÇÃO NO CARRINHO
        const carrinhoBox = document.getElementById('carrinho');
        carrinhoBox.classList.add('animar');
        setTimeout(() => carrinhoBox.classList.remove('animar'), 400);
    }


    function atualizarCarrinho() {
        const lista = document.getElementById('itens-carrinho');
        const totalEl = document.getElementById('total');
        const carrinhoBox = document.getElementById('carrinho');
        const btnLimpar = document.getElementById('btnLimpar');

        lista.innerHTML = '';
        let total = 0;

        carrinho.forEach(item => {
            total += item.preco * item.qtd;
lista.innerHTML += `
    <div class="item-carrinho">
        <div class="item-info">
            <span class="item-nome">${item.nome}</span>

            <div class="controle-qtd">
                <button onclick="diminuirQtd('${item.nome}', '${item.categoria}')">➖</button>
                <span class="qtd">${item.qtd}</span>
                <button onclick="aumentarQtd('${item.nome}', '${item.categoria}')">➕</button>
            </div>
        </div>

        <strong>R$ ${(item.preco * item.qtd).toFixed(2)}</strong>
    </div>
`;

        });

        totalEl.innerText = `R$ ${total.toFixed(2)}`;

        // 👇 CONTROLE DE VISIBILIDADE (estilo iFood)
        if (carrinho.length > 0) {
            carrinhoBox.style.display = 'block';
            btnLimpar.style.display = 'block';
        } else {
            carrinhoBox.style.display = 'none';
            btnLimpar.style.display = 'none';
        }

        salvarCarrinho();
        atualizarContador();

    }

    function limparCarrinho() {
        if (!carrinho.length) return;

        if (confirm('Deseja realmente limpar o carrinho?')) {
            carrinho = [];
            localStorage.removeItem('carrinho');
            atualizarCarrinho();
        }
    }

    function finalizarPedido() {
    if (!carrinho.length) return;

    let msg = 'Olá! Gostaria de fazer o pedido:%0A%0A';
    let total = 0;

    carrinho.forEach(item => {
        msg += `• ${item.qtd}x ${item.nome} - R$ ${(item.preco * item.qtd).toFixed(2)}%0A`;
        total += item.preco * item.qtd;
    });

    msg += `%0A*Total: R$ ${total.toFixed(2)}*`;

    const telefone = '5511999999999';

    // 👉 Abre o WhatsApp
    window.open(`https://wa.me/${telefone}?text=${msg}`, '_blank');

    // 🧹 LIMPA O CARRINHO APÓS ENVIAR
    carrinho = [];
    localStorage.removeItem('carrinho');
    atualizarCarrinho();
}

function atualizarContador() {
    const contador = document.getElementById('contador-carrinho');
    const totalItens = carrinho.reduce((soma, item) => soma + item.qtd, 0);

    contador.innerText = totalItens;

    // esconder se vazio
    contador.style.display = totalItens > 0 ? 'flex' : 'none';
}

function toggleCarrinho() {
    const carrinhoBox = document.getElementById('carrinho');

    if (carrinhoBox.style.display === 'block') {
        carrinhoBox.style.display = 'none';
    } else {
        carrinhoBox.style.display = 'block';
    }
}

function aumentarQtd(nome, categoria) {
    const item = carrinho.find(
        p => p.nome === nome && p.categoria === categoria
    );

    if (item) {
        item.qtd++;
        salvarCarrinho();
        atualizarCarrinho();
    }
}

function diminuirQtd(nome, categoria) {
    const itemIndex = carrinho.findIndex(
        p => p.nome === nome && p.categoria === categoria
    );

    if (itemIndex !== -1) {
        if (carrinho[itemIndex].qtd > 1) {
            carrinho[itemIndex].qtd--;
        } else {
            // se chegar a 1 e clicar ➖, remove o item
            carrinho.splice(itemIndex, 1);
        }

        salvarCarrinho();
        atualizarCarrinho();
    }
}
