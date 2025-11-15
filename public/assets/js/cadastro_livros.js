const form = document.querySelector("#livro-form");
const livroId = new URLSearchParams(window.location.search).get("id");
const baseURL = "http://localhost:3000/livros";

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

  const livro = {
    titulo: document.querySelector("#titulo").value,
    subtitulo: document.querySelector("#subtitulo").value,
    autor: document.querySelector("#autor").value,
    ano: parseInt(document.querySelector("#ano").value),
    paginas: parseInt(document.querySelector("#paginas").value),
    imagem: document.querySelector("#imagem").value,
    descricao: document.querySelector("#descricao").value,
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

function preencherFormulario(livro) {
  document.querySelector("#livro-id").value = livro.id;
  document.querySelector("#titulo").value = livro.titulo;
  document.querySelector("#subtitulo").value = livro.subtitulo;
  document.querySelector("#autor").value = livro.autor;
  document.querySelector("#ano").value = livro.ano;
  document.querySelector("#paginas").value = livro.paginas;
  document.querySelector("#imagem").value = livro.imagem;
  document.querySelector("#descricao").value = livro.descricao;
}
