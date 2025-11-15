const detalhesLivro = document.querySelector(".detalhes-livro-container");
const secundarioContainer = document.querySelector("#secundario-container");
const btn_editar = document.querySelector("#btn-editar");
const btn_excluir = document.querySelector("#btn-excluir");
const grafico = document.getElementById('grafico-pizza');

function armazenarReferenciaLivro() {
    const params = new URLSearchParams(window.location.search);
    const bookId = parseInt(params.get("id"));
    return livro = livros.find(l => l.id === bookId);
}

function popularDetalhesLivro(livro) {
    if (!detalhesLivro) return;

    if (!livro) {
        detalhesLivro.innerHTML = "<p>Livro não encontrado.</p>";
        return;
    }

    // Informações gerais
    detalhesLivro.innerHTML = `
        <div class="col-12 col-lg-auto">
            <img src="${livro.imagem}" alt="${livro.titulo}" class="img-fluid" style="max-width: 250px;">
        </div>
        <div class="col-12 col-lg">
            <h1>${livro.titulo}</h1>
            <p><strong>Subtítulo:</strong> ${livro.subtitulo}</p>
            <p><strong>Autor:</strong> ${livro.autor}</p>
            <p><strong>Descrição:</strong> ${livro.descricao}</p>
            <p><strong>Ano:</strong> ${livro.ano}</p>
            <p><strong>Páginas:</strong> ${livro.paginas}</p>
        </div>
    `;

    document.querySelector("#btn-excluir")?.addEventListener("click", async () => {
        if (confirm("Deseja realmente excluir este livro?")) {
            await fetch(`http://localhost:3000/livros/${livro.id}`, { method: "DELETE" });
            alert("Livro excluído com sucesso!");
            window.location.href = "/index.html";
        }
    });
}

function popularIlustracoes(livro) {
    if (!livro || !secundarioContainer) return;

    // Ilustrações
    if (livro.ilustracoes && livro.ilustracoes.length > 0) {
        secundarioContainer.innerHTML = `
            <h1 class="titulo-secao">Ilustrações</h1>
            <div id="carouselIlustracoes" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators"></div>
                <div class="carousel-inner"></div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselIlustracoes" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselIlustracoes" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `;

        const indicators = secundarioContainer.querySelector(".carousel-indicators");
        const inner = secundarioContainer.querySelector(".carousel-inner");

        livro.ilustracoes.forEach((img, index) => {
            const isActive = index === 0 ? "active" : "";
            const indicator = document.createElement("button");
            indicator.type = "button";
            indicator.setAttribute("data-bs-target", "#carouselIlustracoes");
            indicator.setAttribute("data-bs-slide-to", index);
            indicator.className = isActive;
            indicators.appendChild(indicator);

            const item = document.createElement("div");
            item.className = `carousel-item ${isActive}`;
            item.innerHTML = `
                <div class="img-box">
                    <img src="${img.url}" class="d-block" alt="${img.descricao}">
                </div>
                <div class="carousel-caption d-block">
                    <p>${img.descricao}</p>
                </div>`;
            inner.appendChild(item);
        });
    } else {
        secundarioContainer.innerHTML += `<p>Nenhuma ilustração disponível.</p>`;
    }
}

function popularGraficoPizza(livro) {
    if (!grafico) return;

    let categorias = livro.pov.map(p => p.personagem);
    let valoresPorCategoria = livro.pov.map(p => p.capitulos);
    let cores = [
        "#134074", "#0B2545", "#8DA9C4", "#EEF4ED", "#3D5A80",
        "#98C1D9", "#E0FBFC", "#293241", "#EE6C4D", "#9A031E"
    ].slice(0, categorias.length);

    const divPieChart = new Chart(grafico, {
        type: 'pie',
        data: {
            labels: categorias,
            datasets: [{
                data: valoresPorCategoria,
                backgroundColor: cores,
                borderColor: "#fff",
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#333",
                        font: { size: 14 }
                    }
                },
                datalabels: {
                    color: "#fff",
                    formatter: value => value,
                    font: { weight: "bold", size: 14 }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await carregarLivros();
    const livro = armazenarReferenciaLivro();
    popularDetalhesLivro(livro);
    popularIlustracoes(livro);
    popularGraficoPizza(livro);

    if (btn_editar && livro) {
        btn_editar.href = `/assets/html/cadastro_livros.html?id=${livro.id}`;
    }

    if (btn_excluir && livro) {
        btnExcluir.addEventListener("click", async () => {
            if (confirm("Deseja realmente excluir este livro?")) {
                await fetch(`http://localhost:3001/livros/${livro.id}`, { method: "DELETE" });
                alert("Livro excluído com sucesso!");
                window.location.href = "/index.html";
            }
        });
    }
});
