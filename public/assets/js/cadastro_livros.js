const form = document.querySelector("#livro-form");
const povLista = document.querySelector("#pov-lista");
const adicionarPovBtn = document.querySelector("#adicionar-pov");
const livroId = new URLSearchParams(window.location.search).get("id");
const baseURL = "http://localhost:3000/livros";

function preencherFormulario(livro) {
  document.querySelector("#livro-id").value = livro.id;
  document.querySelector("#titulo").value = livro.titulo;
  document.querySelector("#subtitulo").value = livro.subtitulo;
  document.querySelector("#autor").value = livro.autor;
  document.querySelector("#ano").value = livro.ano;
  document.querySelector("#paginas").value = livro.paginas;
  document.querySelector("#imagem").value = livro.imagem;
  document.querySelector("#descricao").value = livro.descricao;

  // Limpa a lista de POVs existente
  if (povLista) {
    povLista.innerHTML = "";
    livro.pov?.forEach(p => {
      criarEntradaPOV(p.personagem, p.capitulos);
    });
  }


  document.querySelector("#cor-capa").value = livro.cor_capa || "#000000";
}

function criarEntradaPOV(personagem = "", capitulos = "") {
  let div = document.createElement("div");
  div.className = "row g-2 align-items-center mb-2";

  div.innerHTML = `
        <div class="col-md-6">
            <input type="text" class="form-control pov-personagem" placeholder="Personagem" value="${personagem}">
        </div>
        <div class="col-md-3">
            <input type="number" class="form-control pov-capitulos" placeholder="Capítulos" min="0" value="${capitulos}">
        </div>
        <div class="col-md-3">
            <button type="button" class="btn btn-danger w-100 remover-pov">Remover</button>
        </div>
    `;

  div.querySelector(".remover-pov").addEventListener("click", () => {
    div.remove();
  });

  povLista.appendChild(div);
}

document.addEventListener("DOMContentLoaded", async () => {
  if (livroId) {
    document.querySelector(".titulo-secao").textContent = "Editar Livro";
    const response = await fetch(`${baseURL}/${livroId}`);
    const livro = await response.json();
    preencherFormulario(livro);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const pov = Array.from(document.querySelectorAll("#pov-lista .row")).map(row => {
    return {
      personagem: row.querySelector(".pov-personagem").value.trim(),
      capitulos: parseInt(row.querySelector(".pov-capitulos").value) || 0
    };
  }).filter(p => p.personagem.length > 0);

  const livro = {
    titulo: document.querySelector("#titulo").value,
    subtitulo: document.querySelector("#subtitulo").value,
    autor: document.querySelector("#autor").value,
    ano: parseInt(document.querySelector("#ano").value),
    paginas: parseInt(document.querySelector("#paginas").value),
    imagem: document.querySelector("#imagem").value,
    descricao: document.querySelector("#descricao").value,
    pov,
    cor_capa: document.querySelector("#cor-capa").value,
    ilustracoes: []
  };

  if (livroId) {
    await fetch(`${baseURL}/${livroId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livro)
    });
    alert("Livro atualizado com sucesso!");
  } else {
    await fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livro)
    });
    alert("Livro criado com sucesso!");
  }

  window.location.href = "/index.html";
});

adicionarPovBtn?.addEventListener("click", () => {
  criarEntradaPOV();
});