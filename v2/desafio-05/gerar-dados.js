// gerar-dados.js — Cria o ficheiro inventario.json com N equipamentos fictícios
// Uso:  node gerar-dados.js 300      (sem número, gera 30)
// Os dados são sempre os mesmos para o mesmo N, por isso todos veem os mesmos resultados.

const fs = require("fs");

const total = Number(process.argv[2]) || 30;

const modelos = [
  { marca: "Dell", modelo: "Latitude 5490", tipo: "Portátil", preco: 250 },
  { marca: "HP", modelo: "EliteDesk 800", tipo: "Desktop", preco: 180 },
  { marca: "Lenovo", modelo: "ThinkPad T480", tipo: "Portátil", preco: 290 },
  { marca: "Lenovo", modelo: "ThinkCentre M720", tipo: "Desktop", preco: 160 },
  { marca: "HP", modelo: "ProBook 450", tipo: "Portátil", preco: 220 },
  { marca: "Acer", modelo: "Veriton X", tipo: "Desktop", preco: 140 },
];
const estados = ["pronto", "pronto", "pronto", "em reparação", "vendido"];
const discos = ["SSD 256 GB", "SSD 512 GB", "HDD 500 GB", "SSD 240 GB"];

// Gerador de números "aleatórios" mas repetíveis: dá sempre a mesma sequência
let semente = 12345;
function aleatorio() {
  semente = (semente * 1103515245 + 12345) % 2147483648;
  return semente / 2147483648;
}

function escolher(lista) {
  return lista[Math.floor(aleatorio() * lista.length)];
}

const equipamentos = [];
for (let i = 1; i <= total; i++) {
  const m = escolher(modelos);
  equipamentos.push({
    numeroSerie: "INF-" + String(i).padStart(4, "0"),
    marca: m.marca,
    modelo: m.modelo,
    tipo: m.tipo,
    preco: m.preco + Math.floor(aleatorio() * 5) * 10,
    estado: escolher(estados),
    disco: escolher(discos),
    ramGB: escolher([4, 8, 16]),
  });
}

fs.writeFileSync("inventario.json", JSON.stringify(equipamentos, null, 2));
console.log("Criados " + total + " equipamentos em inventario.json");
