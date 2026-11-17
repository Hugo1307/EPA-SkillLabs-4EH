// script.js — Loja pública: mostra nome, preço e descrição de cada equipamento

const zonaProdutos = document.getElementById("produtos");

async function carregarProdutos() {
  const resposta = await fetch("/produtos");
  const produtos = await resposta.json();

  for (const produto of produtos) {
    const cartao = document.createElement("article");
    cartao.className = "produto";
    cartao.innerHTML =
      "<h2>" + produto.nome + "</h2>" +
      '<p class="serie">' + produto.numeroSerie + "</p>" +
      '<p class="preco">' + produto.preco + " €</p>" +
      "<p>" + produto.descricao + "</p>";
    zonaProdutos.appendChild(cartao);
  }
}

carregarProdutos();
