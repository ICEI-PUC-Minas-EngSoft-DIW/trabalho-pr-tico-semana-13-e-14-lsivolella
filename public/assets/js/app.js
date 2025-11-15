let livros = [];

async function carregarLivros() {
  try {
    const response = await fetch("http://localhost:3000/livros");
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    livros = await response.json();
    console.log("Livros carregados:", livros);
  } catch (error) {
    console.error("Erro ao carregar os livros:", error);
  }
}