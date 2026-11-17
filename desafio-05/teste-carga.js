// teste-carga.js — Mede quanto tempo o servidor demora a responder
// Com o servidor a correr noutro terminal:
//   node teste-carga.js          (200 pedidos)
//   node teste-carga.js 500      (500 pedidos)
// Experimenta com 30 equipamentos (node gerar-dados.js 30) e com muitos mais
// (node gerar-dados.js 3000), reiniciando o servidor entre cada teste.

const pedidos = Number(process.argv[2]) || 200;

async function main() {
  const inicio = Date.now();
  let bytes = 0;

  for (let i = 0; i < pedidos; i++) {
    const resposta = await fetch("http://localhost:3000/produtos");
    const texto = await resposta.text();
    bytes = texto.length; // tamanho de uma resposta
  }

  const total = Date.now() - inicio;
  console.log("Pedidos:              " + pedidos);
  console.log("Tempo total:          " + total + " ms");
  console.log("Tempo por pedido:     " + (total / pedidos).toFixed(2) + " ms");
  console.log("Tamanho da resposta:  " + (bytes / 1024).toFixed(1) + " KB");
}

main().catch(() => console.log("Não foi possível ligar ao servidor. Está a correr (node servidor.js)?"));
