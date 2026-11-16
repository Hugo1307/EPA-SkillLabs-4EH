// script.js — Loja: lista todos os equipamentos e permite pesquisar

const campoPesquisa = document.getElementById("pesquisa");
const caixaServidor = document.getElementById("noServidor");
const linhas = document.getElementById("linhas");
const contagem = document.getElementById("contagem");

// Todos os equipamentos, guardados no browser depois do primeiro carregamento
let todos = [];

// Pede ao servidor TODOS os equipamentos de uma só vez
async function carregarTodos() {
  const resposta = await fetch("/produtos");
  todos = await resposta.json();
  mostrar(todos);
}

// Pesquisa no browser: filtra a lista que já foi carregada
function pesquisarNoBrowser(texto) {
  const t = texto.toLowerCase();
  return todos.filter(
    (e) =>
      e.numeroSerie.toLowerCase().includes(t) ||
      e.marca.toLowerCase().includes(t) ||
      e.modelo.toLowerCase().includes(t)
  );
}

// Pesquisa no servidor: pede só os equipamentos que correspondem
async function pesquisarNoServidor(texto) {
  const resposta = await fetch("/produtos?pesquisa=" + encodeURIComponent(texto));
  return await resposta.json();
}

// Desenha a tabela com a lista recebida
function mostrar(lista) {
  linhas.innerHTML = "";

  for (const e of lista) {
    const linha = document.createElement("tr");
    linha.innerHTML =
      "<td>" + e.numeroSerie + "</td>" +
      "<td>" + e.marca + " " + e.modelo + " (" + e.tipo + ")</td>" +
      "<td>" + e.disco + "</td>" +
      "<td>" + e.ramGB + " GB</td>" +
      "<td>" + e.estado + "</td>" +
      "<td>" + e.preco + " €</td>";
    linhas.appendChild(linha);
  }

  contagem.textContent = "A mostrar " + lista.length + " de " + todos.length + " equipamentos";
}

// A cada letra escrita, pesquisa (no browser ou no servidor, conforme a caixa)
campoPesquisa.addEventListener("input", async () => {
  const texto = campoPesquisa.value;

  if (caixaServidor.checked) {
    mostrar(await pesquisarNoServidor(texto));
  } else {
    mostrar(pesquisarNoBrowser(texto));
  }
});

carregarTodos();
