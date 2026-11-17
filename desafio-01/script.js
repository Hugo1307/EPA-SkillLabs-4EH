// script.js — Loja pública: mostra cada equipamento com o seu estado

const zonaProdutos = document.getElementById("produtos");

async function carregarProdutos() {
  const resposta = await fetch("/produtos");
  const produtos = await resposta.json();

  for (const produto of produtos) {
    const cartao = document.createElement("article");
    cartao.className = "produto";
    cartao.innerHTML =
      "<h2>" + produto.marca + " " + produto.modelo + "</h2>" +
      '<p class="serie">' + produto.tipo + " · " + produto.numeroSerie + "</p>" +
      '<p class="preco">' + produto.preco + " €</p>" +
      '<p class="estado">' + produto.estado + "</p>" +
      "<p>" + produto.descricaoEstado + "</p>";
    zonaProdutos.appendChild(cartao);
  }
}

carregarProdutos();
