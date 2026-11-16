/* =============================================================
   DESAFIO 05 — «E se fossem 300 computadores?»
   -------------------------------------------------------------
   Os 300 computadores NÃO estão escritos à mão: são GERADOS por
   código (função gerarComputadores), a partir de listas de marcas,
   modelos, processadores, etc.

   Partes do ficheiro:
     1. Configuração e listas de valores
     2. Gerador de dados (já implementado)
     3. Referências aos elementos da página (DOM)
     4. Funções JÁ IMPLEMENTADAS
     5. Funções POR IMPLEMENTAR  ->  procura os comentários "TODO"
     6. Arranque da aplicação

   Dica: escreve  inventario  na consola (F12) para veres o array completo,
         ou  inventario[0]  para veres o primeiro objeto.
   ============================================================= */


/* -------------------------------------------------------------
   1. CONFIGURAÇÃO E LISTAS DE VALORES
   ------------------------------------------------------------- */
const TOTAL_COMPUTADORES = 300;

const ESTADOS = {
  DISPONIVEL: "Disponível",
  MANUTENCAO: "Em manutenção",
  VENDIDO: "Vendido",
  ABATIDO: "Abatido"
};

// Cada marca tem um prefixo (usado no número de série) e uma lista de modelos
const MARCAS = [
  { nome: "Lenovo", prefixo: "LEN", modelos: ["ThinkPad T480", "ThinkPad X270", "ThinkCentre M720q", "IdeaPad 5"] },
  { nome: "HP",     prefixo: "HP",  modelos: ["EliteBook 840 G5", "ProBook 450 G5", "EliteDesk 800 G3", "ProDesk 400 G4"] },
  { nome: "Dell",   prefixo: "DEL", modelos: ["Latitude 7490", "Latitude 5400", "OptiPlex 7050", "Vostro 3580"] },
  { nome: "Apple",  prefixo: "APL", modelos: ["MacBook Air 2017", "MacBook Pro 2018", "iMac 21.5 2017"] },
  { nome: "Asus",   prefixo: "ASU", modelos: ["VivoBook 15", "ExpertBook B1", "ZenBook 14"] },
  { nome: "Acer",   prefixo: "ACE", modelos: ["Aspire 5", "TravelMate P2", "Veriton N4"] }
];

const TIPOS           = ["Portátil", "Desktop", "All-in-One"];
const PROCESSADORES   = ["Intel i3", "Intel i5", "Intel i7", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7"];
const MEMORIAS_RAM    = [4, 8, 8, 16, 16, 32];          // em GB (8 e 16 aparecem mais vezes)
const ARMAZENAMENTOS  = ["128 GB SSD", "256 GB SSD", "512 GB SSD", "1 TB HDD", "1 TB SSD"];


/* -------------------------------------------------------------
   2. GERADOR DE DADOS  (já implementado — não precisas de alterar)
   ------------------------------------------------------------- */

// Gerador pseudoaleatório com "semente": gera SEMPRE os mesmos 300 computadores,
// para que todos na turma vejam os mesmos dados e possam comparar resultados.
let semente = 2026;
function aleatorio() {
  semente = (semente * 9301 + 49297) % 233280;
  return semente / 233280; // número entre 0 e 1
}

function inteiroEntre(minimo, maximo) {
  return Math.floor(aleatorio() * (maximo - minimo + 1)) + minimo;
}

function escolher(lista) {
  return lista[Math.floor(aleatorio() * lista.length)];
}

// Escolhe um estado com probabilidades diferentes (há mais disponíveis do que abatidos)
function escolherEstado() {
  const n = aleatorio();
  if (n < 0.50) return ESTADOS.DISPONIVEL;  // 50 %
  if (n < 0.75) return ESTADOS.MANUTENCAO;  // 25 %
  if (n < 0.93) return ESTADOS.VENDIDO;     // 18 %
  return ESTADOS.ABATIDO;                   //  7 %
}

/**
 * Gera um array com "quantidade" computadores fictícios.
 * Cada computador é um objeto com esta forma:
 * {
 *   numeroSerie: "HP-2026-0042",
 *   marca: "HP",
 *   modelo: "ProBook 450 G5",
 *   tipo: "Portátil",
 *   processador: "Intel i5",
 *   ram: 8,                     // número (GB)
 *   armazenamento: "256 GB SSD",
 *   dataEntrada: "2026-03-14",  // texto no formato AAAA-MM-DD
 *   preco: 249,                 // número (euros)
 *   estado: "Disponível"
 * }
 */
function gerarComputadores(quantidade) {
  const lista = [];

  for (let i = 1; i <= quantidade; i++) {
    const marca = escolher(MARCAS);
    const ram = escolher(MEMORIAS_RAM);
    const mes = String(inteiroEntre(1, 10)).padStart(2, "0");
    const dia = String(inteiroEntre(1, 28)).padStart(2, "0");

    lista.push({
      numeroSerie: marca.prefixo + "-2026-" + String(i).padStart(4, "0"),
      marca: marca.nome,
      modelo: escolher(marca.modelos),
      tipo: escolher(TIPOS),
      processador: escolher(PROCESSADORES),
      ram: ram,
      armazenamento: escolher(ARMAZENAMENTOS),
      dataEntrada: "2026-" + mes + "-" + dia,
      preco: 120 + ram * 8 + inteiroEntre(0, 25) * 10,
      estado: escolherEstado()
    });
  }

  return lista;
}

// O ARRAY PRINCIPAL com todos os computadores
const inventario = gerarComputadores(TOTAL_COMPUTADORES);


/* -------------------------------------------------------------
   3. ELEMENTOS DA PÁGINA (DOM)
   ------------------------------------------------------------- */
const campoPesquisa       = document.getElementById("campo-pesquisa");
const filtroEstado        = document.getElementById("filtro-estado");
const seletorOrdenacao    = document.getElementById("ordenacao");
const botaoLimpar         = document.getElementById("botao-limpar");
const corpoTabela         = document.getElementById("corpo-tabela");
const contadorResultados  = document.getElementById("contador-resultados");
const zonaMensagem        = document.getElementById("mensagem");

const estatTotal          = document.getElementById("estat-total");
const estatDisponiveis    = document.getElementById("estat-disponiveis");
const estatManutencao     = document.getElementById("estat-manutencao");
const estatVendidos       = document.getElementById("estat-vendidos");


/* -------------------------------------------------------------
   4. FUNÇÕES JÁ IMPLEMENTADAS
   ------------------------------------------------------------- */

function formatarPreco(valor) {
  return valor.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

// "2026-03-14" -> "14/03/2026"
function formatarData(dataISO) {
  const partes = dataISO.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

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
 * Mostra na tabela os computadores de uma lista.
 * (Constrói todo o HTML numa só string e só depois o coloca na página,
 *  o que é muito mais rápido do que acrescentar linha a linha.)
 */
function mostrarTabela(lista) {
  let html = "";

  for (const c of lista) {
    html += `
      <tr>
        <td class="serie">${c.numeroSerie}</td>
        <td>${c.marca}</td>
        <td>${c.modelo}</td>
        <td>${c.tipo}</td>
        <td>${c.processador}</td>
        <td class="numero">${c.ram} GB</td>
        <td>${c.armazenamento}</td>
        <td>${formatarData(c.dataEntrada)}</td>
        <td class="numero">${formatarPreco(c.preco)}</td>
        <td><span class="estado ${classeDoEstado(c.estado)}">${c.estado}</span></td>
      </tr>`;
  }

  corpoTabela.innerHTML = html;
}

/**
 * Mostra uma mensagem de feedback ("sucesso", "aviso", "erro" ou "info").
 */
function mostrarMensagem(tipo, texto) {
  zonaMensagem.className = "alerta alerta--" + tipo;
  zonaMensagem.textContent = texto;
}

function limparMensagem() {
  zonaMensagem.className = "alerta";
  zonaMensagem.textContent = "";
}

/**
 * Função central: lê os filtros, aplica-os ao inventário e mostra o resultado.
 * É chamada sempre que o utilizador escreve na pesquisa ou muda um filtro.
 *
 * Repara que NUNCA alteramos o array "inventario": cada passo cria uma nova lista.
 */
function aplicarFiltros() {
  let resultado = inventario;

  resultado = pesquisarPorSerie(resultado, campoPesquisa.value);   // TODO 2
  resultado = filtrarPorEstado(resultado, filtroEstado.value);     // TODO 3
  resultado = ordenarComputadores(resultado, seletorOrdenacao.value); // TODO 4

  mostrarTabela(resultado);
  mostrarResultados(resultado.length);                             // TODO 5
}


/* -------------------------------------------------------------
   5. FUNÇÕES POR IMPLEMENTAR
   ------------------------------------------------------------- */

/**
 * TODO 1 — Estatísticas do inventário  (dificuldade: ★☆☆)
 *
 * Conta, no array "inventario" COMPLETO:
 *   - o número total de computadores
 *   - quantos estão "Disponível"
 *   - quantos estão "Em manutenção"
 *   - quantos estão "Vendido"
 * e escreve cada valor no cartão correspondente:
 *   estatTotal, estatDisponiveis, estatManutencao, estatVendidos
 *   (ex.: estatTotal.textContent = 300;)
 *
 * Pistas: .length; um ciclo for...of com contadores e if;
 *         ou .filter(...).length
 */
function atualizarEstatisticas() {
  // TODO 1: escreve aqui o teu código

}

/**
 * TODO 2 — Pesquisar por número de série  (dificuldade: ★★☆)
 *
 * Devolve uma NOVA lista só com os computadores cujo numeroSerie
 * CONTÉM o texto pesquisado (não precisa de ser igual).
 *   - ignora espaços no início/fim e maiúsculas/minúsculas
 *   - se o texto estiver vazio, devolve a lista completa
 *
 * Exemplos:
 *   "hp"        -> todos os HP
 *   "0042"      -> o computador n.º 42
 *   "LEN-2026"  -> todos os Lenovo
 *
 * Pistas: .trim(), .toUpperCase(), .includes(), .filter()
 */
function pesquisarPorSerie(lista, texto) {
  // TODO 2: escreve aqui o teu código

  return lista; // <- substitui esta linha
}

/**
 * TODO 3 — Filtrar por estado  (dificuldade: ★☆☆)
 *
 * Devolve uma NOVA lista só com os computadores cujo estado é igual ao recebido.
 * Se o estado for "todos", devolve a lista sem alterações.
 *
 * Pista: .filter()
 */
function filtrarPorEstado(lista, estado) {
  // TODO 3: escreve aqui o teu código

  return lista; // <- substitui esta linha
}

/**
 * TODO 4 — Ordenar os computadores  (dificuldade: ★★★)
 *
 * Devolve uma NOVA lista ordenada segundo o critério recebido:
 *   "serie-asc"  -> número de série, de A a Z
 *   "marca-asc"  -> marca, de A a Z
 *   "preco-asc"  -> preço, do mais barato para o mais caro
 *   "preco-desc" -> preço, do mais caro para o mais barato
 *   "data-desc"  -> data de entrada, da mais recente para a mais antiga
 *
 * Atenção:
 *   - .sort() ALTERA o array original! Faz primeiro uma cópia: const copia = [...lista];
 *   - para números:  copia.sort(function (a, b) { return a.preco - b.preco; });
 *   - para textos:   a.marca.localeCompare(b.marca)
 *   - as datas estão no formato "AAAA-MM-DD", por isso podem ser comparadas como texto
 */
function ordenarComputadores(lista, criterio) {
  // TODO 4: escreve aqui o teu código

  return lista; // <- substitui esta linha
}

/**
 * TODO 5 — Contador e mensagem de resultados  (dificuldade: ★☆☆)
 *
 * Recebe o número de computadores que ficaram depois dos filtros.
 *   - Escreve no contadorResultados: "A mostrar X de 300 computadores"
 *     (usa inventario.length em vez de escrever 300)
 *   - Se X for 0 -> mostrarMensagem("aviso", "Nenhum computador corresponde aos filtros escolhidos.")
 *     senão     -> limparMensagem()
 */
function mostrarResultados(quantidade) {
  // TODO 5: escreve aqui o teu código

}

/**
 * TODO 6 — Limpar filtros  (dificuldade: ★☆☆)
 *
 * Chamada pelo botão "Limpar filtros":
 *   - apaga o texto da pesquisa
 *   - volta a pôr o filtro de estado em "todos"
 *   - volta a pôr a ordenação em "serie-asc"
 *   - chama aplicarFiltros() para atualizar a tabela
 */
function limparFiltros() {
  // TODO 6: escreve aqui o teu código

}


/* -------------------------------------------------------------
   6. ARRANQUE DA APLICAÇÃO
   ------------------------------------------------------------- */
campoPesquisa.addEventListener("input", aplicarFiltros);
filtroEstado.addEventListener("change", aplicarFiltros);
seletorOrdenacao.addEventListener("change", aplicarFiltros);
botaoLimpar.addEventListener("click", limparFiltros);

atualizarEstatisticas();
aplicarFiltros();
