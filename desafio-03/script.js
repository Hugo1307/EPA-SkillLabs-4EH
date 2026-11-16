/* =============================================================
   DESAFIO 03 — «Qualquer pessoa pode entrar na gestão»
   -------------------------------------------------------------
   NOTA IMPORTANTE: isto é uma SIMULAÇÃO PEDAGÓGICA.
   As palavras-passe estão escritas neste ficheiro e qualquer pessoa
   as pode ver (F12 > Fontes). Num sistema real, a verificação do login
   é feita no SERVIDOR e as palavras-passe nunca são guardadas em texto.

   Como funciona a aplicação:
     - Há 4 "ecrãs" na mesma página: login, consulta, gestao e negado.
     - O ecrã visível depende do endereço: index.html#login,
       index.html#consulta, index.html#gestao
     - Sempre que o endereço muda, é chamada a função router().

   O PROBLEMA: neste momento, qualquer pessoa que escreva
   index.html#gestao no browser vê a área de gestão, sem login!

   Partes do ficheiro:
     1. Dados (utilizadores e produtos)
     2. Estado da aplicação (quem tem sessão iniciada)
     3. Referências aos elementos da página (DOM)
     4. Funções JÁ IMPLEMENTADAS
     5. Funções POR IMPLEMENTAR  ->  procura os comentários "TODO"
     6. Arranque da aplicação
   ============================================================= */


/* -------------------------------------------------------------
   1. DADOS
   ------------------------------------------------------------- */

// Perfis possíveis
const PERFIS = {
  ADMIN: "admin",            // pode consultar e aceder à gestão
  UTILIZADOR: "utilizador"   // só pode consultar
};

// Contas fictícias
const utilizadores = [
  { utilizador: "admin",  palavraPasse: "Admin#2026",  nome: "Ana Ferreira", perfil: PERFIS.ADMIN },
  { utilizador: "gestor", palavraPasse: "Gestor#2026", nome: "Rui Costa",    perfil: PERFIS.ADMIN },
  { utilizador: "joao",   palavraPasse: "Joao#2026",   nome: "João Silva",   perfil: PERFIS.UTILIZADOR },
  { utilizador: "maria",  palavraPasse: "Maria#2026",  nome: "Maria Santos", perfil: PERFIS.UTILIZADOR }
];

// Produtos do marketplace.
// Dados PÚBLICOS: numeroSerie, produto, caracteristicas, preco
// Dados INTERNOS (só a equipa): custo, fornecedor
const produtos = [
  { numeroSerie: "INF-2026-0001", produto: "Lenovo ThinkPad T480",    caracteristicas: "i5-8350U · 8 GB · 256 GB SSD", preco: 289, custo: 140, fornecedor: "Lote Empresas Norte" },
  { numeroSerie: "INF-2026-0002", produto: "HP EliteDesk 800 G3",     caracteristicas: "i5-6500 · 8 GB · 240 GB SSD",  preco: 199, custo: 85,  fornecedor: "Câmara Municipal (leilão)" },
  { numeroSerie: "INF-2026-0005", produto: "Lenovo ThinkCentre M720q", caracteristicas: "i5-8400T · 16 GB · 256 GB SSD", preco: 179, custo: 70, fornecedor: "Lote Empresas Norte" },
  { numeroSerie: "INF-2026-0008", produto: "Dell OptiPlex 7050",      caracteristicas: "i7-7700 · 16 GB · 512 GB SSD", preco: 189, custo: 95,  fornecedor: "Escola Secundária (doação)" },
  { numeroSerie: "INF-2026-0010", produto: "Lenovo IdeaCentre AIO 3", caracteristicas: "Ryzen 5 · 8 GB · 512 GB SSD", preco: 299, custo: 160, fornecedor: "Particular" },
  { numeroSerie: "INF-2026-0011", produto: "Dell Latitude 5400",      caracteristicas: "i5-8365U · 16 GB · 256 GB SSD", preco: 309, custo: 150, fornecedor: "Lote Empresas Norte" }
];


/* -------------------------------------------------------------
   2. ESTADO DA APLICAÇÃO
   Guarda o objeto do utilizador que tem a sessão iniciada.
   null significa "ninguém fez login".
   ------------------------------------------------------------- */
let utilizadorAtual = null;


/* -------------------------------------------------------------
   3. ELEMENTOS DA PÁGINA (DOM)
   ------------------------------------------------------------- */
const formLogin           = document.getElementById("form-login");
const campoUtilizador     = document.getElementById("campo-utilizador");
const campoPalavraPasse   = document.getElementById("campo-palavra-passe");
const botaoMostrar        = document.getElementById("botao-mostrar");
const botaoSair           = document.getElementById("botao-sair");

const barraSessao         = document.getElementById("barra-sessao");
const sessaoNome          = document.getElementById("sessao-nome");
const sessaoPerfil        = document.getElementById("sessao-perfil");

const tabelaConsulta      = document.getElementById("tabela-consulta");
const tabelaGestao        = document.getElementById("tabela-gestao");
const textoNegado         = document.getElementById("texto-negado");
const botaoNegado         = document.getElementById("botao-negado");


/* -------------------------------------------------------------
   4. FUNÇÕES JÁ IMPLEMENTADAS
   ------------------------------------------------------------- */

function formatarPreco(valor) {
  return valor.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

/**
 * Mostra apenas o ecrã indicado e esconde os outros.
 * @param {string} nome - "login", "consulta", "gestao" ou "negado"
 */
function mostrarEcra(nome) {
  const ecras = document.querySelectorAll(".ecra");
  for (const ecra of ecras) {
    ecra.classList.add("escondido");
  }
  document.getElementById("ecra-" + nome).classList.remove("escondido");

  // Marca o link ativo na navegação
  const links = document.querySelectorAll(".navegacao a");
  for (const link of links) {
    link.classList.toggle("ativo", link.dataset.ecra === nome);
  }
}

/**
 * Mostra uma mensagem de feedback numa das zonas de mensagens.
 * @param {string} zona  - "login", "consulta" ou "gestao"
 * @param {string} tipo  - "sucesso", "aviso", "erro" ou "info"
 * @param {string} texto - o texto a apresentar
 *
 * Exemplo: mostrarMensagem("login", "erro", "Acesso negado: credenciais inválidas.");
 */
function mostrarMensagem(zona, tipo, texto) {
  const elemento = document.getElementById("mensagem-" + zona);
  elemento.className = "alerta alerta--" + tipo;
  elemento.textContent = texto;
}

/**
 * Apaga a mensagem de uma zona.
 */
function limparMensagem(zona) {
  const elemento = document.getElementById("mensagem-" + zona);
  elemento.className = "alerta";
  elemento.textContent = "";
}

/**
 * Mostra o ecrã "Acesso negado" com o motivo indicado.
 * @param {string} motivo - texto que explica porque o acesso foi negado
 * @param {string} destinoBotao - para onde vai o botão: "#login" ou "#consulta"
 */
function mostrarAcessoNegado(motivo, destinoBotao) {
  textoNegado.textContent = motivo;
  botaoNegado.href = destinoBotao;
  botaoNegado.textContent = destinoBotao === "#login" ? "Ir para o login" : "Voltar à consulta";
  mostrarEcra("negado");
}

/**
 * Atualiza a barra de sessão do cabeçalho (nome, perfil, botão sair).
 * Se utilizadorAtual for null, a barra fica escondida.
 */
function atualizarBarraSessao() {
  if (utilizadorAtual === null) {
    barraSessao.classList.add("escondido");
    return;
  }
  sessaoNome.textContent = utilizadorAtual.nome;
  sessaoPerfil.textContent = utilizadorAtual.perfil === PERFIS.ADMIN ? "Administrador" : "Utilizador";
  barraSessao.classList.remove("escondido");
}

/**
 * Preenche a tabela da consulta (só dados públicos).
 */
function preencherTabelaConsulta() {
  tabelaConsulta.innerHTML = "";
  for (const p of produtos) {
    tabelaConsulta.innerHTML += `
      <tr>
        <td class="serie">${p.numeroSerie}</td>
        <td>${p.produto}</td>
        <td>${p.caracteristicas}</td>
        <td class="numero">${formatarPreco(p.preco)}</td>
      </tr>`;
  }
}

/**
 * Preenche a tabela da gestão (dados públicos + internos).
 */
function preencherTabelaGestao() {
  tabelaGestao.innerHTML = "";
  for (const p of produtos) {
    tabelaGestao.innerHTML += `
      <tr>
        <td class="serie">${p.numeroSerie}</td>
        <td>${p.produto}</td>
        <td class="numero">${formatarPreco(p.preco)}</td>
        <td class="numero confidencial">${formatarPreco(p.custo)}</td>
        <td class="numero confidencial">${formatarPreco(p.preco - p.custo)}</td>
        <td class="confidencial">${p.fornecedor}</td>
      </tr>`;
  }
}

/**
 * Botão "Mostrar/Esconder" da palavra-passe.
 */
function alternarPalavraPasse() {
  const estaEscondida = campoPalavraPasse.type === "password";
  campoPalavraPasse.type = estaEscondida ? "text" : "password";
  botaoMostrar.textContent = estaEscondida ? "Esconder" : "Mostrar";
}

/**
 * ROUTER: decide que ecrã mostrar conforme o endereço (o que vem depois do #).
 * É chamado no arranque e sempre que o endereço muda.
 */
function router() {
  const destino = location.hash.replace("#", "") || "login";

  if (destino === "gestao") {
    abrirGestao();
  } else if (destino === "consulta") {
    abrirConsulta();
  } else {
    mostrarEcra("login");
  }
}


/* -------------------------------------------------------------
   5. FUNÇÕES POR IMPLEMENTAR
   ------------------------------------------------------------- */

/**
 * TODO 1 — Validar os campos do formulário  (dificuldade: ★☆☆)
 *
 * Devolve true se os DOIS campos estiverem preenchidos e false caso contrário.
 * Atenção: um campo só com espaços ("   ") deve contar como vazio.
 *
 * Exemplos:
 *   camposPreenchidos("joao", "Joao#2026")  -> true
 *   camposPreenchidos("", "Joao#2026")      -> false
 *   camposPreenchidos("   ", "abc")         -> false
 *
 * Pista: .trim() e o operador && ou ||
 */
function camposPreenchidos(utilizador, palavraPasse) {
  // TODO 1: escreve aqui o teu código

  return true; // <- substitui esta linha
}

/**
 * TODO 2 — Procurar a conta com as credenciais indicadas  (dificuldade: ★★☆)
 *
 * Percorre o array "utilizadores" e devolve o OBJETO da conta cujo
 * utilizador E palavraPasse coincidem com os recebidos.
 * Se não existir, devolve null.
 *
 * Regras:
 *   - o nome de utilizador NÃO distingue maiúsculas ("JOAO" = "joao")
 *   - a palavra-passe DISTINGUE maiúsculas ("joao#2026" é errada)
 *
 * Pistas: ciclo for...of ou .find(); .toLowerCase(); operador &&
 */
function verificarCredenciais(utilizador, palavraPasse) {
  // TODO 2: escreve aqui o teu código

  return null; // <- substitui esta linha
}

/**
 * TODO 3 — Fazer login  (dificuldade: ★★☆)
 *
 * Chamada quando se carrega em "Entrar".
 * Passos:
 *   a) Lê os valores de campoUtilizador e campoPalavraPasse.
 *   b) Se os campos não estiverem preenchidos (TODO 1) -> mensagem "aviso"
 *      na zona "login" e termina.
 *   c) Verifica as credenciais (TODO 2).
 *   d) Se a conta não existir -> mensagem "erro":
 *      "Acesso negado: utilizador ou palavra-passe incorretos."
 *      (Não digas qual dos dois está errado — porque será?)
 *      Limpa o campo da palavra-passe e termina.
 *   e) Se existir:
 *        - guarda a conta em utilizadorAtual
 *        - atualizarBarraSessao()
 *        - limpa o formulário (formLogin.reset())
 *        - se for administrador: location.hash = "#gestao"
 *          senão:                 location.hash = "#consulta"
 *        - mostra "Acesso autorizado. Bem-vindo(a), <nome>!" na zona certa
 *          ("gestao" ou "consulta")
 */
function fazerLogin(evento) {
  evento.preventDefault(); // impede o formulário de recarregar a página

  // TODO 3: escreve aqui o teu código

  // Remove esta linha quando implementares o login:
  mostrarMensagem("login", "info", "O login ainda não foi implementado (ver TODO 1, 2 e 3 no script.js).");
}

/**
 * TODO 4 — Proteger a área de gestão  (dificuldade: ★★☆)
 *
 * ESTE É O PROBLEMA DO DESAFIO: neste momento a gestão abre para toda a gente!
 * Antes de mostrar a gestão, verifica:
 *   - Se ninguém fez login (utilizadorAtual === null):
 *       mostrarAcessoNegado("Tem de iniciar sessão para aceder à área de gestão.", "#login")
 *       e termina.
 *   - Se o utilizador NÃO for administrador:
 *       mostrarAcessoNegado("A sua conta não tem permissão para aceder à gestão.", "#consulta")
 *       e termina.
 *   - Só se for administrador é que mostra a gestão (as 2 linhas que já existem).
 *
 * Teste: usa o botão «Abrir index.html#gestao sem login» antes e depois.
 */
function abrirGestao() {
  // TODO 4: escreve aqui a verificação

  preencherTabelaGestao();
  mostrarEcra("gestao");
}

/**
 * TODO 5 — Proteger a consulta  (dificuldade: ★☆☆)
 *
 * A consulta pode ser vista por QUALQUER perfil, mas só depois do login.
 * Se utilizadorAtual for null, mostra o ecrã de acesso negado
 * (com o botão a apontar para "#login") e termina.
 */
function abrirConsulta() {
  // TODO 5: escreve aqui a verificação

  preencherTabelaConsulta();
  mostrarEcra("consulta");
}

/**
 * TODO 6 — Terminar sessão  (dificuldade: ★☆☆)
 *
 * Chamada quando se carrega em "Terminar sessão".
 *   - utilizadorAtual volta a null
 *   - atualizarBarraSessao()
 *   - volta para o login: location.hash = "#login"
 *     (atenção: se o endereço já for #login, o router não é chamado —
 *      nesse caso chama mostrarEcra("login") diretamente)
 *   - mensagem "info" na zona "login": "Sessão terminada."
 *
 * Teste: depois de sair, tenta abrir index.html#gestao — tem de ser negado.
 */
function terminarSessao() {
  // TODO 6: escreve aqui o teu código

}


/* -------------------------------------------------------------
   6. ARRANQUE DA APLICAÇÃO
   ------------------------------------------------------------- */
formLogin.addEventListener("submit", fazerLogin);
botaoMostrar.addEventListener("click", alternarPalavraPasse);
botaoSair.addEventListener("click", terminarSessao);
window.addEventListener("hashchange", router);

atualizarBarraSessao();
router();
