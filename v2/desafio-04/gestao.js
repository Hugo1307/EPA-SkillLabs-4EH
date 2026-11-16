// gestao.js — Aplicação de gestão: regista equipamentos e mostra os preços

const linhas = document.getElementById("linhas");
const formulario = document.getElementById("formulario");
const zonaMensagem = document.getElementById("mensagem");

// Mostra "—" quando um campo não se aplica ao equipamento
function valor(texto) {
  return texto === null || texto === undefined ? "—" : texto;
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
      "<td>" + e.modelo + "</td>" +
      "<td>" + valor(e.disco) + "</td>" +
      "<td>" + (e.ramGB ? e.ramGB + " GB" : "—") + "</td>" +
      "<td>" + (e.bateriaSaude ? e.bateriaSaude + "%" : "—") + "</td>" +
      "<td>" + valor(e.ecra) + "</td>" +
      "<td>" + e.preco + " €</td>";
    linhas.appendChild(linha);
  }
}

// Envia o novo equipamento ao servidor, com o preço que a equipa decidiu
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const resposta = await fetch("/api/equipamentos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      numeroSerie: document.getElementById("numeroSerie").value,
      modelo: document.getElementById("modelo").value,
      nome: document.getElementById("nome").value,
      descricao: document.getElementById("descricao").value,
      disco: document.getElementById("disco").value,
      ramGB: Number(document.getElementById("ramGB").value),
      bateriaSaude: Number(document.getElementById("bateriaSaude").value),
      ecra: document.getElementById("ecra").value,
      preco: Number(document.getElementById("preco").value),
    }),
  });
  const dados = await resposta.json();

  if (resposta.ok) {
    zonaMensagem.textContent = "Registado com o preço de " + dados.preco + " €.";
    zonaMensagem.className = "mensagem sucesso";
    formulario.reset();
    carregarEquipamentos();
  } else {
    zonaMensagem.textContent = dados.mensagem;
    zonaMensagem.className = "mensagem erro";
  }
});

carregarEquipamentos();
