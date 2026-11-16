// servidor.js — Servidor do marketplace Inforlândia
// Arrancar com:  node servidor.js
// Abrir no browser:  http://localhost:3000

const http = require("http");
const fs = require("fs");

const PORTA = 3000;
const FICHEIRO_INVENTARIO = "inventario.json";

// ---------- Inventário (ficheiro inventario.json) ----------

function lerInventario() {
  return JSON.parse(fs.readFileSync(FICHEIRO_INVENTARIO, "utf-8"));
}

function guardarInventario(equipamentos) {
  fs.writeFileSync(FICHEIRO_INVENTARIO, JSON.stringify(equipamentos, null, 2));
}

// ---------- Ações do servidor ----------

// Lista para o site: só o que o cliente precisa de ver
function listarProdutos(resposta) {
  const produtos = lerInventario().map((e) => ({
    numeroSerie: e.numeroSerie,
    nome: e.nome,
    preco: e.preco,
    descricao: e.descricao,
  }));
  responderJSON(resposta, 200, produtos);
}

// Lista completa, para a aplicação de gestão
function listarEquipamentos(resposta) {
  responderJSON(resposta, 200, lerInventario());
}

// Regista um equipamento novo. A gestão envia todos os campos, incluindo o preço
// que a equipa decidiu: { numeroSerie, modelo, nome, preco, descricao, disco, ramGB, bateriaSaude, ecra }
function registarEquipamento(dados, resposta) {
  const equipamentos = lerInventario();

  if (equipamentos.some((e) => e.numeroSerie === dados.numeroSerie)) {
    responderJSON(resposta, 409, { mensagem: "Esse número de série já está registado." });
    return;
  }

  if (typeof dados.preco !== "number" || dados.preco <= 0) {
    responderJSON(resposta, 400, { mensagem: "O preço tem de ser um número maior que zero." });
    return;
  }

  const equipamento = {
    numeroSerie: dados.numeroSerie,
    modelo: dados.modelo,
    nome: dados.nome,
    preco: dados.preco,
    descricao: dados.descricao,
    disco: dados.disco || null,
    ramGB: dados.ramGB || null,
    bateriaSaude: dados.bateriaSaude || null,
    ecra: dados.ecra || null,
  };

  equipamentos.push(equipamento);
  guardarInventario(equipamentos);
  responderJSON(resposta, 201, equipamento);
}

// ---------- Servidor ----------

const servidor = http.createServer((pedido, resposta) => {
  console.log(pedido.method + " " + pedido.url);

  if (pedido.method === "GET" && pedido.url === "/") {
    enviarFicheiro(resposta, "index.html", "text/html");
  } else if (pedido.method === "GET" && pedido.url === "/script.js") {
    enviarFicheiro(resposta, "script.js", "text/javascript");
  } else if (pedido.method === "GET" && pedido.url === "/style.css") {
    enviarFicheiro(resposta, "style.css", "text/css");
  } else if (pedido.method === "GET" && pedido.url === "/produtos") {
    listarProdutos(resposta);

    // Aplicação de gestão
  } else if (pedido.method === "GET" && pedido.url === "/gestao") {
    enviarFicheiro(resposta, "gestao.html", "text/html");
  } else if (pedido.method === "GET" && pedido.url === "/gestao.js") {
    enviarFicheiro(resposta, "gestao.js", "text/javascript");
  } else if (pedido.method === "GET" && pedido.url === "/api/equipamentos") {
    listarEquipamentos(resposta);
  } else if (pedido.method === "POST" && pedido.url === "/api/equipamentos") {
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
