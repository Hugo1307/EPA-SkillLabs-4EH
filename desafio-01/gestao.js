// gestao.js — Aplicação de gestão: regista equipamentos e envia-os logo ao servidor

const linhas = document.getElementById("linhas");
const formulario = document.getElementById("formulario");
const zonaMensagem = document.getElementById("mensagem");

// Mostra "—" quando um campo não se aplica ao equipamento
function valor(texto, sufixo) {
  return texto === null || texto === undefined || texto === "" ? "—" : texto + (sufixo || "");
}

// Pede ao servidor todos os equipamentos e preenche a tabela
async function carregarEquipamentos() {
  const resposta = await fetch("/api/equipamentos");
  const equipamentos = await resposta.json();

  linhas.innerHTML = "";
  for (const e of equipamentos) {
    const linha = document.createElement("tr");
    linha.innerHTML =
      "<td>" + e.numeroSerie + "</td>" +
      "<td>" + e.marca + " " + e.modelo + " (" + e.tipo + ")</td>" +
      "<td>" + e.estado + "</td>" +
      "<td>" + valor(e.avaria) + "</td>" +
      "<td>" + valor(e.custoReparacao, " €") + "</td>" +
      "<td>" + valor(e.valorRevenda, " €") + "</td>";
    linhas.appendChild(linha);
  }
}

// Ao registar, o equipamento é enviado logo ao servidor
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const resposta = await fetch("/api/equipamentos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      numeroSerie: document.getElementById("numeroSerie").value,
      tipo: document.getElementById("tipo").value,
      marca: document.getElementById("marca").value,
      modelo: document.getElementById("modelo").value,
      estado: document.getElementById("estado").value,
      avaria: document.getElementById("avaria").value,
      custoReparacao: Number(document.getElementById("custoReparacao").value),
      valorRevenda: Number(document.getElementById("valorRevenda").value),
      descricaoEstado: document.getElementById("descricaoEstado").value,
    }),
  });
  const dados = await resposta.json();

  if (resposta.ok) {
    zonaMensagem.textContent = "Equipamento " + dados.numeroSerie + " registado no inventário.";
    zonaMensagem.className = "mensagem sucesso";
    formulario.reset();
    carregarEquipamentos();
  } else {
    zonaMensagem.textContent = dados.mensagem;
    zonaMensagem.className = "mensagem erro";
  }
});

carregarEquipamentos();
