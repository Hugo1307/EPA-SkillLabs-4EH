/* =============================================================
   DESAFIO 02 — «O cliente comprou um computador que já não existe»
   -------------------------------------------------------------
   Este ficheiro está dividido em 5 partes:
     1. Dados (lista de computadores)
     2. Referências aos elementos da página (DOM)
     3. Funções JÁ IMPLEMENTADAS (podes usá-las, não precisas de as alterar)
     4. Funções POR IMPLEMENTAR  ->  procura os comentários "TODO"
     5. Arranque da aplicação

   Abre a consola do browser (F12 > Consola) para ver erros e
   usa console.log() sempre que quiseres perceber o que está a acontecer.
   ============================================================= */


/* -------------------------------------------------------------
   1. DADOS
   Cada computador é um OBJETO com várias propriedades.
   Todos os computadores estão guardados num ARRAY.
   ------------------------------------------------------------- */

// Estados possíveis de um equipamento
const ESTADOS = {
  DISPONIVEL: "Disponível",
  MANUTENCAO: "Em manutenção",
  VENDIDO: "Vendido",
  ABATIDO: "Abatido"
};

const computadores = [
  { numeroSerie: "INF-2026-0001", marca: "Lenovo", modelo: "ThinkPad T480",       tipo: "Portátil", preco: 289, estado: ESTADOS.DISPONIVEL },
  { numeroSerie: "INF-2026-0002", marca: "HP",     modelo: "EliteDesk 800 G3",    tipo: "Desktop",  preco: 199, estado: ESTADOS.DISPONIVEL },
  { numeroSerie: "INF-2026-0003", marca: "Dell",   modelo: "Latitude 7490",       tipo: "Portátil", preco: 319, estado: ESTADOS.VENDIDO },
  { numeroSerie: "INF-2026-0004", marca: "Apple",  modelo: "MacBook Air 2017",    tipo: "Portátil", preco: 349, estado: ESTADOS.MANUTENCAO },
  { numeroSerie: "INF-2026-0005", marca: "Lenovo", modelo: "ThinkCentre M720q",   tipo: "Desktop",  preco: 179, estado: ESTADOS.DISPONIVEL },
  { numeroSerie: "INF-2026-0006", marca: "Asus",   modelo: "VivoBook 15",         tipo: "Portátil", preco: 229, estado: ESTADOS.ABATIDO },
  { numeroSerie: "INF-2026-0007", marca: "HP",     modelo: "ProBook 450 G5",      tipo: "Portátil", preco: 259, estado: ESTADOS.VENDIDO },
  { numeroSerie: "INF-2026-0008", marca: "Dell",   modelo: "OptiPlex 7050",       tipo: "Desktop",  preco: 189, estado: ESTADOS.DISPONIVEL },
  { numeroSerie: "INF-2026-0009", marca: "Acer",   modelo: "Aspire 5",            tipo: "Portátil", preco: 209, estado: ESTADOS.MANUTENCAO },
  { numeroSerie: "INF-2026-0010", marca: "Lenovo", modelo: "IdeaCentre AIO 3",    tipo: "All-in-One", preco: 299, estado: ESTADOS.DISPONIVEL }
];


/* -------------------------------------------------------------
   2. ELEMENTOS DA PÁGINA (DOM)
   ------------------------------------------------------------- */
const formPesquisa      = document.getElementById("form-pesquisa");
const campoPesquisa     = document.getElementById("campo-pesquisa");
const botaoLimpar       = document.getElementById("botao-limpar");
const zonaMensagem      = document.getElementById("mensagem");
const zonaResultado     = document.getElementById("resultado");
const corpoTabela       = document.getElementById("corpo-tabela");
const totalEquipamentos = document.getElementById("total-equipamentos");


/* -------------------------------------------------------------
   3. FUNÇÕES JÁ IMPLEMENTADAS
   ------------------------------------------------------------- */

/**
 * Formata um número como preço em euros. Ex.: 289 -> "289,00 €"
 */
function formatarPreco(valor) {
  return valor.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

/**
 * Devolve a classe CSS correspondente a um estado.
 * Ex.: "Vendido" -> "estado--vendido"
 */
function classeDoEstado(estado) {
  switch (estado) {
    case ESTADOS.DISPONIVEL: return "estado--disponivel";
    case ESTADOS.MANUTENCAO: return "estado--manutencao";
    case ESTADOS.VENDIDO:    return "estado--vendido";
    case ESTADOS.ABATIDO:    return "estado--abatido";
    default:                 return "";
  }
}

/**
 * Cria o HTML da etiqueta colorida de um estado.
 */
function criarEtiquetaEstado(estado) {
  return `<span class="estado ${classeDoEstado(estado)}">${estado}</span>`;
}

/**
 * Mostra todos os computadores de uma lista na tabela.
 * Cada linha (<tr>) tem o atributo data-serie com o número de série,
 * o que te vai ser útil no TODO 4.
 */
function mostrarTabela(lista) {
  corpoTabela.innerHTML = "";

  for (const computador of lista) {
    const linha = document.createElement("tr");
    linha.dataset.serie = computador.numeroSerie;
    linha.innerHTML = `
      <td class="serie">${computador.numeroSerie}</td>
      <td>${computador.marca}</td>
      <td>${computador.modelo}</td>
      <td>${computador.tipo}</td>
      <td class="numero">${formatarPreco(computador.preco)}</td>
      <td>${criarEtiquetaEstado(computador.estado)}</td>
    `;

    // Ao clicar numa linha, o número de série é copiado para a caixa de pesquisa
    linha.addEventListener("click", function () {
      campoPesquisa.value = computador.numeroSerie;
      campoPesquisa.focus();
    });

    corpoTabela.appendChild(linha);
  }

  totalEquipamentos.textContent = lista.length;
}

/**
 * Mostra uma mensagem de feedback.
 * @param {string} tipo  - "sucesso", "aviso", "erro" ou "info"
 * @param {string} texto - o texto a apresentar
 *
 * Exemplo: mostrarMensagem("erro", "Computador não encontrado.");
 */
function mostrarMensagem(tipo, texto) {
  zonaMensagem.className = "alerta alerta--" + tipo;
  zonaMensagem.textContent = texto;
}

/**
 * Apaga a mensagem de feedback.
 */
function limparMensagem() {
  zonaMensagem.className = "alerta";
  zonaMensagem.textContent = "";
}

/**
 * Mostra a ficha (detalhes) de um computador na zona "Resultado".
 * Inclui o botão "Registar venda", que chama a função venderComputador (TODO 5).
 */
function mostrarFichaComputador(computador) {
  zonaResultado.innerHTML = `
    <dl class="ficha">
      <div><dt>N.º de série</dt><dd class="serie">${computador.numeroSerie}</dd></div>
      <div><dt>Marca</dt><dd>${computador.marca}</dd></div>
      <div><dt>Modelo</dt><dd>${computador.modelo}</dd></div>
      <div><dt>Tipo</dt><dd>${computador.tipo}</dd></div>
      <div><dt>Preço</dt><dd>${formatarPreco(computador.preco)}</dd></div>
      <div><dt>Estado</dt><dd>${criarEtiquetaEstado(computador.estado)}</dd></div>
      <div class="ficha__acoes">
        <button type="button" id="botao-vender" class="botao botao--sucesso botao--pequeno">Registar venda</button>
      </div>
    </dl>
  `;

  document.getElementById("botao-vender").addEventListener("click", function () {
    venderComputador(computador.numeroSerie);
  });
}

/**
 * Volta a colocar a zona "Resultado" no estado inicial.
 */
function limparFicha() {
  zonaResultado.innerHTML = '<p class="texto-suave">Ainda não foi feita nenhuma pesquisa.</p>';
}

/**
 * Botão "Limpar": apaga a pesquisa, a mensagem e a ficha.
 */
function limparPesquisa() {
  campoPesquisa.value = "";
  limparMensagem();
  limparFicha();
  destacarLinha(null); // retira o destaque de todas as linhas (TODO 4)
  campoPesquisa.focus();
}


/* -------------------------------------------------------------
   4. FUNÇÕES POR IMPLEMENTAR
   ------------------------------------------------------------- */

/**
 * TODO 1 — Normalizar o número de série  (dificuldade: ★☆☆)
 *
 * O utilizador pode escrever " inf-2026-0003 " (com espaços e minúsculas).
 * Esta função deve devolver o texto:
 *   - sem espaços no início e no fim
 *   - em MAIÚSCULAS
 *
 * Exemplo: normalizarNumeroSerie("  inf-2026-0003 ")  ->  "INF-2026-0003"
 *
 * Pistas: .trim()  e  .toUpperCase()
 */
function normalizarNumeroSerie(texto) {
  // TODO 1: escreve aqui o teu código

  return texto; // <- substitui esta linha
}

/**
 * TODO 2 — Procurar um computador no array  (dificuldade: ★★☆)
 *
 * Percorre o array "computadores" e devolve o OBJETO do computador
 * cujo numeroSerie seja igual ao recebido.
 * Se não existir nenhum, devolve null.
 *
 * Exemplo:
 *   procurarComputador("INF-2026-0001")  ->  { numeroSerie: "INF-2026-0001", marca: "Lenovo", ... }
 *   procurarComputador("INF-9999-0000")  ->  null
 *
 * Pistas: podes usar um ciclo for...of com um if,
 *         ou o método .find() dos arrays.
 */
function procurarComputador(numeroSerie) {
  // TODO 2: escreve aqui o teu código

  return null; // <- substitui esta linha
}

/**
 * TODO 3 — Pesquisar e mostrar o estado do equipamento  (dificuldade: ★★☆)
 *
 * Esta função é chamada quando se carrega em "Pesquisar".
 * Passos:
 *   a) Lê o valor da caixa de pesquisa (campoPesquisa.value) e normaliza-o (TODO 1).
 *   b) Se o campo estiver vazio -> mensagem "aviso": "Introduza um número de série."
 *      e termina a função (return).
 *   c) Procura o computador (TODO 2).
 *   d) Se NÃO existir -> limparFicha() e mensagem "erro":
 *        "Não existe nenhum computador com o número de série XXX."
 *   e) Se existir -> mostrarFichaComputador(computador) e uma mensagem conforme o estado:
 *        - Disponível    -> "sucesso": pode ser vendido
 *        - Em manutenção -> "info":    ainda não está pronto para venda
 *        - Vendido       -> "aviso":   já foi vendido, NÃO pode ser vendido outra vez
 *        - Abatido       -> "erro":    foi abatido ao inventário, já não existe para venda
 *   f) Chama destacarLinha(numeroSerie) para destacar a linha na tabela (TODO 4).
 *
 * Funções úteis já prontas: mostrarMensagem(tipo, texto), mostrarFichaComputador(computador),
 *                           limparFicha(), e a constante ESTADOS.
 */
function pesquisar(evento) {
  evento.preventDefault(); // impede o formulário de recarregar a página

  // TODO 3: escreve aqui o teu código

  // Remove esta linha quando implementares a pesquisa:
  mostrarMensagem("info", "A pesquisa ainda não foi implementada (ver TODO 1, 2 e 3 no script.js).");
}

/**
 * TODO 4 — Destacar a linha do computador na tabela  (dificuldade: ★★☆)
 *
 * 1. Retira a classe "linha--destacada" de TODAS as linhas da tabela.
 * 2. Se numeroSerie não for null, adiciona a classe "linha--destacada"
 *    à linha (<tr>) cujo data-serie seja igual a numeroSerie.
 *
 * Pistas: corpoTabela.querySelectorAll("tr"), linha.dataset.serie,
 *         linha.classList.add(...) e linha.classList.remove(...)
 */
function destacarLinha(numeroSerie) {
  // TODO 4: escreve aqui o teu código

}

/**
 * TODO 5 — Registar uma venda SEM permitir vender duas vezes  (dificuldade: ★★★)
 *
 * Este é o problema central do desafio: um computador foi vendido duas vezes!
 * Quando se carrega em "Registar venda":
 *   a) Procura o computador (TODO 2).
 *   b) Se o estado NÃO for "Disponível" -> mensagem "erro" a explicar porque não
 *      pode ser vendido (ex.: "Venda recusada: o computador INF-2026-0003 está Vendido.")
 *      e termina a função.
 *   c) Se estiver disponível:
 *        - muda o estado do objeto para ESTADOS.VENDIDO
 *        - volta a desenhar a tabela: mostrarTabela(computadores)
 *        - volta a mostrar a ficha atualizada: mostrarFichaComputador(computador)
 *        - volta a destacar a linha (a tabela foi redesenhada!)
 *        - mensagem "sucesso": "Venda registada..."
 *
 * Teste: vende o INF-2026-0001 e depois tenta vendê-lo outra vez.
 */
function venderComputador(numeroSerie) {
  // TODO 5: escreve aqui o teu código

  // Remove esta linha quando implementares a venda:
  mostrarMensagem("info", "O registo de vendas ainda não foi implementado (ver TODO 5 no script.js).");
}


/* -------------------------------------------------------------
   5. ARRANQUE DA APLICAÇÃO
   ------------------------------------------------------------- */
formPesquisa.addEventListener("submit", pesquisar);
botaoLimpar.addEventListener("click", limparPesquisa);

mostrarTabela(computadores);
