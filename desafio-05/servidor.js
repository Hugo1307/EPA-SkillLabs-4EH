// servidor.js — Servidor do marketplace Inforlândia
// Arrancar com:  node servidor.js
// Abrir no browser:  http://localhost:3000

const http = require("http");
const fs = require("fs");

const PORTA = 3000;
const FICHEIRO_INVENTARIO = "inventario.json";

// ---------- Inventário (ficheiro inventario.json) ----------

// Lê o ficheiro inteiro e devolve a lista de equipamentos
function lerInventario() {
  return JSON.parse(fs.readFileSync(FICHEIRO_INVENTARIO, "utf-8"));
}

// Escreve o ficheiro inteiro com a lista de equipamentos
function guardarInventario(equipamentos) {
  fs.writeFileSync(FICHEIRO_INVENTARIO, JSON.stringify(equipamentos, null, 2));
}

// ---------- Ações do servidor ----------

// Devolve os equipamentos ao site.
// Sem pesquisa, devolve todos. Com ?pesquisa=texto, o servidor filtra e devolve só os que contêm o texto.
function listarProdutos(pesquisa, resposta) {
  let equipamentos = lerInventario();

  if (pesquisa) {
    const texto = pesquisa.toLowerCase();
    equipamentos = equipamentos.filter(
      (e) =>
        e.numeroSerie.toLowerCase().includes(texto) ||
        e.marca.toLowerCase().includes(texto) ||
        e.modelo.toLowerCase().includes(texto)
    );
  }

  responderJSON(resposta, 200, equipamentos);
}

// Regista um equipamento novo (a gestão envia os campos do equipamento)
function registarEquipamento(dados, resposta) {
  const equipamentos = lerInventario();

  if (equipamentos.some((e) => e.numeroSerie === dados.numeroSerie)) {
    responderJSON(resposta, 409, { mensagem: "Esse número de série já está registado." });
    return;
  }

  equipamentos.push(dados);
  guardarInventario(equipamentos);
  responderJSON(resposta, 201, dados);
}

// ---------- Servidor ----------

const servidor = http.createServer((pedido, resposta) => {
  console.log(pedido.method + " " + pedido.url);

  const endereco = new URL(pedido.url, "http://localhost");
  const caminho = endereco.pathname;

  if (pedido.method === "GET" && caminho === "/") {
    enviarFicheiro(resposta, "index.html", "text/html");
  } else if (pedido.method === "GET" && caminho === "/script.js") {
    enviarFicheiro(resposta, "script.js", "text/javascript");
  } else if (pedido.method === "GET" && caminho === "/style.css") {
    enviarFicheiro(resposta, "style.css", "text/css");
  } else if (pedido.method === "GET" && caminho === "/produtos") {
    listarProdutos(endereco.searchParams.get("pesquisa"), resposta);
  } else if (pedido.method === "POST" && caminho === "/api/equipamentos") {
    lerCorpo(pedido, resposta, (dados) => registarEquipamento(dados, resposta));
  } else {
    responderJSON(resposta, 404, { mensagem: "Página não encontrada." });
  }
});

servidor.listen(PORTA, () => {
  console.log("Servidor a correr em http://localhost:" + PORTA);
});

// ---------- Funções auxiliares ----------

// O corpo do pedido chega aos poucos; juntamos tudo antes de o usar
function lerCorpo(pedido, resposta, quandoPronto) {
  let corpo = "";
  pedido.on("data", (parte) => (corpo += parte));
  pedido.on("end", () => {
    try {
      quandoPronto(JSON.parse(corpo));
    } catch (erro) {
      responderJSON(resposta, 400, { mensagem: "Pedido inválido." });
    }
  });
}

function enviarFicheiro(resposta, nome, tipo) {
  resposta.writeHead(200, { "Content-Type": tipo + "; charset=utf-8" });
  resposta.end(fs.readFileSync(nome));
}

function responderJSON(resposta, codigo, dados) {
  resposta.writeHead(codigo, { "Content-Type": "application/json; charset=utf-8" });
  resposta.end(JSON.stringify(dados));
}
