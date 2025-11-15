const carouselSlide = document.querySelector(".carousel");
const carouselIndicators = document.querySelector(".carousel-indicators");
const carouselInner = document.querySelector(".carousel-inner");
const cardsGrid = document.querySelector(".livros-grid");
const grafico = document.getElementById('grafico-barras');

function popularCarousel() {
    if (!carouselSlide || !carouselIndicators || !carouselInner) return;

    let livrosSorteados = [...livros].sort(() => 0.5 - Math.random()).slice(0, 3);

    carouselIndicators.innerHTML = "";
    carouselInner.innerHTML = "";

    livrosSorteados.forEach((livro, index) => {
        const isActive = index === 0 ? "active" : "";

        popularIndicadoresCarousel(index, isActive);
        popularItensCarousel(livro, isActive);
    });
}

function popularIndicadoresCarousel(index, isActive) {
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.setAttribute("data-bs-target", "#carouselExampleIndicators");
    indicator.setAttribute("data-bs-slide-to", index);
    indicator.setAttribute("aria-label", `Slide ${index + 1}`);
    if (isActive) {
        indicator.classList.add("active");
        indicator.setAttribute("aria-current", "true");
    }
    carouselIndicators.appendChild(indicator);
}

function popularItensCarousel(livro, isActive) {
    const item = document.createElement("div");
    item.className = `carousel-item ${isActive}`;
    item.innerHTML = `
    <a href="/assets/html/detalhes.html?id=${livro.id}">
        <img src="${livro.imagem}" class="carousel-img d-block w-100" alt="${livro.titulo}">
        <div class="carousel-caption d-block">
        <h5>${livro.titulo}</h5>
        <p>${livro.autor}</p>
        </div>
    </a>
    `;
    carouselInner.appendChild(item);
}

function popularCards() {
    if (!cardsGrid) return;

    cardsGrid.innerHTML = '';

    livros.forEach(livro => {
        const col = document.createElement('div');
        col.className = "col";

        col.innerHTML = `
        <div class="card h-100">
            <a href="/assets/html/detalhes.html?id=${livro.id}">
                <img src="${livro.imagem}" class="card-img-top" alt="${livro.titulo}">
                <div class="card-body">
                    <h5 class="card-title">${livro.titulo}</h5>
                    <p class="card-text">${livro.autor}</p>
                    <p class="card-text">Ano: ${livro.ano}</p>
                    <p class="card-text">Páginas: ${livro.paginas}</p>
                    <div class="mt-4 d-flex align-items-center justify-content-center">
                        <a id="btn-editar" href="/assets/html/cadastro_livros.html?id=${livro.id}" class="btn btn-warning me-2">Editar</a>
                        <button class="btn btn-danger" data-id="${livro.id}">Excluir</button>
                    </div>
                </div>
            </a>
        </div>`;
        cardsGrid.appendChild(col);
    });
}

function popularGraficoBarras() {
    if (!grafico) return;

    new Chart(grafico, {
        type: 'bar',
        plugins: [ChartDataLabels],
        data: {
            labels: livros.map(livro => livro.titulo),
            datasets: [{
                label: "Número de Páginas",
                data: livros.map(livro => livro.paginas),
                backgroundColor: livros.map(livro => livro.cor_capa || 'rgba(54, 162, 235, 0.2)'),
                borderWidth: 0,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: false },
                datalabels: {
                    color: "#000",
                    anchor: "end",
                    align: "end",
                    font: {
                        weight: "bold",
                        size: 14
                    },
                    formatter: (value) => `${value}`
                }
            },
            scales: {
                y: {
                    display: false,
                    grid: { display: false }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: "#333", font: { size: 14 } }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await carregarLivros();
    popularCarousel();
    popularCards();
    popularGraficoBarras();
});

cardsGrid.addEventListener("click", async (event) => {
    const livroId = event.target.dataset.id;
    if (!livroId) return;

    if (event.target.matches(".btn-warning")) {
        event.preventDefault();
        window.location.href = `/assets/html/cadastro_livros.html?id=${livroId}`;
    }

    if (event.target.matches(".btn-danger")) {
        event.preventDefault();
        if (confirm("Deseja realmente excluir este livro?")) {
            await fetch(`http://localhost:3000/livros/${livroId}`, { method: "DELETE" });
            alert("Livro excluído com sucesso!");
            await carregarLivros();
            popularCarousel();
            popularCards();
        }
    }
});