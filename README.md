# EPA Desafios v2 — SkillLABS 1 · 4EH

Cinco pequenos projetos baseados nos desafios do **SkillLABS 1** (Inforlândia: recondicionamento de equipamento informático e marketplace online).

Cada projeto é uma aplicação web **que já funciona**, com uma loja e, em alguns casos, uma aplicação de gestão, ligadas a um **servidor** escrito em JavaScript. O teu trabalho **não é escrever a aplicação de raiz**: é **explorá-la, perceber como funciona e responder ao desafio**. Em alguns desafios há um problema para encontrar e corrigir; noutros, há uma decisão para tomar e justificar.

| Pasta | Desafio | Tipo de trabalho |
|---|---|---|
| `desafio-01/` | Este computador não liga | Diagnosticar e decidir: recondicionar ou abater |
| `desafio-02/` | O cliente comprou um que já não existe | Encontrar o erro e corrigi-lo |
| `desafio-03/` | Qualquer pessoa pode entrar na gestão | Encontrar os problemas de segurança e corrigi-los |
| `desafio-04/` | Vale cem euros ou cinquenta? | Justificar os preços e propor uma regra |
| `desafio-05/` | E se fossem trezentos computadores? | Medir, decidir o que escala e o que não escala |

Cada grupo trabalha **no seu desafio**. Dentro do grupo, cada aluno assume uma **estação** (E1 a E5) e prepara aquilo que tem de apresentar e justificar no dia do SkillLabs.

---

## Como correr o código

### 1. Instalar o Node.js

Os servidores são programas em JavaScript, por isso precisas do **Node.js** instalado no computador.

1. Abre **https://nodejs.org** e descarrega a versão **LTS** (a recomendada).
2. Abre o ficheiro descarregado e segue o instalador (aceita as opções por defeito). Funciona em Windows e macOS.
3. **Fecha e volta a abrir** o terminal (ou o VS Code) depois de instalar.
4. Confirma que ficou instalado. Num terminal, escreve:

```
node --version
```

Deve aparecer um número de versão, por exemplo `v22.11.0`. Se aparecer um erro como *«node não é reconhecido como comando»*, o Node não ficou instalado ou o terminal ainda não foi reiniciado.

> Não precisas de instalar mais nada. **Não é preciso `npm install`**: os projetos usam apenas o que já vem com o Node.

### 2. Abrir o terminal na pasta do desafio

No **VS Code**:

1. Abre a pasta do teu desafio (`Ficheiro > Abrir Pasta…`), por exemplo `v2/desafio-02`.
2. Abre o terminal: `Terminal > Novo Terminal`. O terminal já abre dentro da pasta certa.

Noutro terminal, usa `cd` para ir até à pasta:

```
cd caminho/para/v2/desafio-02
```

### 3. Arrancar o servidor

```
node servidor.js
```

Deve aparecer a mensagem:

```
Servidor a correr em http://localhost:3000
```

### 4. Abrir no browser

Abre **http://localhost:3000** no browser. O terminal vai mostrando cada pedido que o servidor recebe (por exemplo `GET /produtos`). Isto é muito útil para perceber o que acontece quando carregas num botão.

### 5. Parar o servidor

No terminal, carrega em **`Ctrl + C`**.

### Quando é preciso reiniciar?

| Alteraste… | O que fazer |
|---|---|
| `index.html`, `script.js`, `style.css`, `gestao.js`, … | Guarda e atualiza o browser (`F5`) |
| `inventario.json` | Atualiza o browser (`F5`) |
| `servidor.js` | **Para o servidor (`Ctrl + C`) e arranca outra vez (`node servidor.js`)** |

### Problemas comuns

| Problema | Causa e solução |
|---|---|
| `EADDRINUSE: address already in use :::3000` | Já há um servidor a correr na porta 3000 (um terminal esquecido, ou outro desafio). Fecha-o com `Ctrl + C` no terminal onde está, ou fecha todos os terminais e tenta outra vez. |
| `node não é reconhecido…` / `command not found: node` | O Node não está instalado, ou o terminal foi aberto antes da instalação. Reinstala e volta a abrir o terminal. |
| A página não abre | Confirma que o servidor está a correr e que escreveste `http://localhost:3000`. |
| Fiz alterações e a página não mudou | Atualiza com `F5`. Se alteraste o `servidor.js`, reinicia o servidor. |

### Dicas para explorares o projeto

- Abre as **ferramentas do browser** (`F12`). No separador **Rede** vês cada pedido que a página faz ao servidor e o que o servidor responde. No separador **Consola** aparecem os erros.
- Abre o `servidor.js` e procura as **rotas**: é o que o servidor sabe fazer.
- Os dados ficam em **ficheiros** (`inventario.json` e, nalguns desafios, ficheiros na pasta `dados/`). Abre-os no editor para veres o que está guardado.
- **Antes de alterares um ficheiro de dados**, faz uma cópia dele. Nos desafios 1, 4 e 5 a aplicação de gestão escreve no `inventario.json`, e assim podes voltar ao estado inicial.

### Regras

- Usa apenas **HTML, CSS, JavaScript e Node.js**. Sem bibliotecas nem frameworks.
- Cada desafio é independente: corre **um servidor de cada vez** (todos usam a porta 3000).
- Quando corrigires ou alterares algo, **sabe explicar o que mudaste e porquê**. Faz parte da avaliação.

### Estrutura

```
v2/
├── desafio-01/   servidor.js · inventario.json · index.html · gestao.html · … · dados/
├── desafio-02/   servidor.js · inventario.json · index.html · … · dados/
├── desafio-03/   servidor.js · inventario.json · utilizadores.json · login.html · gestao.html · … · dados/
├── desafio-04/   servidor.js · inventario.json · index.html · gestao.html · … · dados/
├── desafio-05/   servidor.js · inventario.json · gerar-dados.js · teste-carga.js · …
└── README.md     (este documento)
```