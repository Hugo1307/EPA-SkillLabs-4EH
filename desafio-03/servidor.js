// servidor.js — Servidor do marketplace Inforlândia
// Arrancar com:  node servidor.js
// Abrir no browser:  http://localhost:3000

const http = require("http");
const fs = require("fs");
const crypto = require("crypto");

const PORTA = 3000;

// Sessões ativas: guarda "código da sessão" -> nome do utilizador.
// Fica em memória: se o servidor reiniciar, ninguém está ligado.
const sessoes = {};

// ---------- Dados ----------

function lerInventario() {
  return JSON.parse(fs.readFileSync("inventario.json", "utf-8"));
}

function lerUtilizadores() {
  return JSON.parse(fs.readFileSync("utilizadores.json", "utf-8"));
}

// Dados que qualquer visitante pode ver (preço e características).
// O custo e o fornecedor são internos: só a equipa deve vê-los.
function camposPublicos(produto) {
  return {
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco,
    caracteristicas: produto.caracteristicas,
  };
}

// ---------- Sessão e cookie ----------

// Lê o cookie "sessao" do pedido e devolve o nome do utilizador ligado,
// ou null se não houver sessão válida.
function utilizadorLigado(pedido) {
  const cookies = pedido.headers.cookie || "";
  const par = cookies.split("; ").find((c) => c.startsWith("sessao="));
  if (!par) return null;

  const codigo = par.split("=")[1];
  return sessoes[codigo] || null;
}

// ---------- Ações do servidor ----------

// Lista pública de produtos, para a loja
function listarProdutos(resposta) {
  responderJSON(resposta, 200, lerInventario());
}

// Dados completos, para a área de gestão
function dadosGestao(resposta) {
  responderJSON(resposta, 200, lerInventario());
}

// Login: o site envia { utilizador, palavraPasse }
function entrar(dados, resposta) {
  const conta = lerUtilizadores().find(
    (u) => u.utilizador === dados.utilizador && u.palavraPasse === dados.palavraPasse
  );

  if (!conta) {
    responderJSON(resposta, 401, { mensagem: "Utilizador ou palavra-passe incorretos." });
    return;
  }

  // Cria um código aleatório, guarda-o na lista de sessões e entrega-o ao browser num cookie
  const codigo = crypto.randomBytes(16).toString("hex");
  sessoes[codigo] = conta.utilizador;

  responderJSON(resposta, 200, { mensagem: "Sessão iniciada." }, {
    "Set-Cookie": "sessao=" + codigo + "; HttpOnly; Path=/",
  });
}

// Logout: apaga a sessão e o cookie
function sair(pedido, resposta) {
  const cookies = pedido.headers.cookie || "";
  const par = cookies.split("; ").find((c) => c.startsWith("sessao="));
  if (par) delete sessoes[par.split("=")[1]];

  responderJSON(resposta, 200, { mensagem: "Sessão terminada." }, {
    "Set-Cookie": "sessao=; Max-Age=0; Path=/",
  });
}

// ---------- Servidor ----------

const servidor = http.createServer((pedido, resposta) => {
  console.log(pedido.method + " " + pedido.url);

  // Páginas e ficheiros da loja
  if (pedido.method === "GET" && pedido.url === "/") {
    enviarFicheiro(resposta, "index.html", "text/html");
  } else if (pedido.method === "GET" && pedido.url === "/script.js") {
    enviarFicheiro(resposta, "script.js", "text/javascript");
  } else if (pedido.method === "GET" && pedido.url === "/style.css") {
    enviarFicheiro(resposta, "style.css", "text/css");
  } else if (pedido.method === "GET" && pedido.url === "/produtos") {
    listarProdutos(resposta);

    // Página de login
  } else if (pedido.method === "GET" && pedido.url === "/login") {
    enviarFicheiro(resposta, "login.html", "text/html");
  } else if (pedido.method === "GET" && pedido.url === "/login.js") {
    enviarFicheiro(resposta, "login.js", "text/javascript");
  } else if (pedido.method === "POST" && pedido.url === "/login") {
    lerCorpo(pedido, resposta, (dados) => entrar(dados, resposta));
  } else if (pedido.method === "POST" && pedido.url === "/logout") {
    sair(pedido, resposta);

    // Área de gestão
  } else if (pedido.method === "GET" && pedido.url === "/gestao") {
    enviarFicheiro(resposta, "gestao.html", "text/html");
  } else if (pedido.method === "GET" && pedido.url === "/gestao.js") {
    enviarFicheiro(resposta, "gestao.js", "text/javascript");
  } else if (pedido.method === "GET" && pedido.url === "/api/gestao") {
    dadosGestao(resposta);
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

function responderJSON(resposta, codigo, dados, cabecalhosExtra) {
  resposta.writeHead(codigo, {
    "Content-Type": "application/json; charset=utf-8",
    ...cabecalhosExtra,
  });
  resposta.end(JSON.stringify(dados));
}
