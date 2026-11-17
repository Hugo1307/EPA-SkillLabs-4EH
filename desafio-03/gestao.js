// gestao.js — Área de gestão: mostra os dados internos e permite terminar a sessão

const linhas = document.getElementById("linhas");

async function carregarGestao() {
  const resposta = await fetch("/api/gestao");
  const produtos = await resposta.json();

  for (const produto of produtos) {
    const margem = produto.preco - produto.custo;
    const linha = document.createElement("tr");
    linha.innerHTML =
      "<td>" + produto.nome + "</td>" +
      "<td>" + produto.preco + " €</td>" +
      "<td>" + produto.custo + " €</td>" +
      "<td>" + margem + " €</td>" +
      "<td>" + produto.fornecedor + "</td>";
    linhas.appendChild(linha);
  }
}

document.getElementById("sair").addEventListener("click", async () => {
  await fetch("/logout", { method: "POST" });
  window.location.href = "/login";
});

carregarGestao();
