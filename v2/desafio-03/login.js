// login.js — Envia o utilizador e a palavra-passe ao servidor

const formulario = document.getElementById("formulario");
const zonaMensagem = document.getElementById("mensagem");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const resposta = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      utilizador: document.getElementById("utilizador").value,
      palavraPasse: document.getElementById("palavraPasse").value,
    }),
  });
  const dados = await resposta.json();

  if (resposta.ok) {
    window.location.href = "/gestao"; // login certo: vai para a gestão
  } else {
    zonaMensagem.textContent = dados.mensagem;
    zonaMensagem.className = "mensagem erro";
  }
});
