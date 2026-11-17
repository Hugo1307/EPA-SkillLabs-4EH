// script.js — Loja pública: mostra preço e características dos produtos

const zonaProdutos = document.getElementById("produtos");

async function carregarProdutos() {
  const resposta = await fetch("/produtos");
  const produtos = await resposta.json();

  for (const produto of produtos) {
    const cartao = document.createElement("article");
    cartao.className = "produto";
    cartao.innerHTML =
      "<h2>" + produto.nome + "</h2>" +
      '<p class="preco">' + produto.preco + " €</p>" +
      "<p>" + produto.caracteristicas + "</p>";
    zonaProdutos.appendChild(cartao);
  }
}

carregarProdutos();
