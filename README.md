# EPA Desafios — SkillLABS 1 · 4EH

Três pequenos projetos de programação baseados nos desafios do **SkillLABS 1** (Inforlandia: recondicionamento de equipamento informático e marketplace online).

Cada projeto já **funciona** e já tem o **aspeto final**, mas faltam algumas funcionalidades. O teu trabalho é **ler o código existente, perceber como está organizado e implementar o que falta**. As tarefas estão marcadas no `script.js` com comentários `TODO`.

| Pasta | Desafio | Tema de programação | Dificuldade |
|---|---|---|---|
| `desafio-02/` | O cliente comprou um computador que já não existe | arrays, objetos, pesquisa, `if/else` | ★★☆ |
| `desafio-03/` | Qualquer pessoa pode entrar na gestão | validação, login, perfis e permissões | ★★☆ |
| `desafio-05/` | E se fossem 300 computadores? | `filter`, `sort`, contagens, filtros combinados | ★★★ |

---

## Como começar

1. Abre a pasta do desafio e faz **duplo clique em `index.html`**. Abre no browser e não precisa de servidor nem de internet.
2. Abre o `script.js` num editor (por exemplo, o VS Code).
3. Abre a **consola do browser** (`F12`, separador *Consola*). É lá que aparecem os erros e as mensagens de `console.log()`.
4. Resolve os `TODO` **pela ordem**: muitas tarefas usam a função da tarefa anterior.
5. Depois de cada alteração, **guarda o ficheiro e atualiza a página** (`F5`).

### Regras

- Trabalha **só** nas funções marcadas com `TODO`. As outras funções já funcionam, e podes (e deves) usá-las.
- Quando uma função tem uma linha `return ...; // <- substitui esta linha` ou uma mensagem *"ainda não foi implementado"*, **apaga-a** quando escreveres a tua solução.
- Usa apenas **HTML, CSS e JavaScript** (sem bibliotecas, sem frameworks, sem servidor).
- Testa **todos os casos** da lista de testes de cada desafio, incluindo os casos de erro.

### Estrutura

```
EPA-Desafios/
├── desafio-02/   index.html · style.css · script.js
├── desafio-03/   index.html · style.css · script.js
├── desafio-05/   index.html · style.css · script.js
└── README.md     (este documento)
```

Os três `script.js` estão organizados da mesma forma: **dados → elementos da página (DOM) → funções já implementadas → funções por implementar (TODO) → arranque**.

Os três `style.css` partilham a mesma base visual: cores, botões, campos, tabelas, mensagens e etiquetas de estado. As classes mais úteis são:

| Classe | Para quê |
|---|---|
| `alerta alerta--sucesso` / `--aviso` / `--erro` / `--info` | mensagens de feedback |
| `estado estado--disponivel` / `--manutencao` / `--vendido` / `--abatido` | etiquetas coloridas de estado |
| `botao`, `botao--secundario`, `botao--perigo`, `botao--sucesso` | botões |
| `escondido` | esconde um elemento |

---

## Desafio 02 — «O cliente comprou um computador que já não existe»

### Contexto

Um computador foi vendido duas vezes no site: a segunda venda aconteceu depois de o equipamento já ter saído do inventário. Antes de confirmar uma venda, a equipa precisa de uma ferramenta que diga se o computador **existe** e em que **estado** está.

### O que já está feito

- Lista de **10 computadores** fictícios (array de objetos) com número de série, marca, modelo, tipo, preço e estado.
- Tabela com todos os computadores e etiquetas coloridas por estado.
- Caixa de pesquisa, botão *Limpar* e clique numa linha para copiar o número de série.
- Funções prontas: `mostrarMensagem(tipo, texto)`, `mostrarFichaComputador(computador)`, `limparFicha()`, `mostrarTabela(lista)`.

### Tarefas

| TODO | Função | O que fazer | Dificuldade |
|---|---|---|---|
| 1 | `normalizarNumeroSerie(texto)` | Retirar espaços e passar para maiúsculas | ★☆☆ |
| 2 | `procurarComputador(numeroSerie)` | Percorrer o array e devolver o computador, ou `null` se não existir | ★★☆ |
| 3 | `pesquisar(evento)` | Validar o campo, procurar e mostrar uma mensagem diferente para cada estado | ★★☆ |
| 4 | `destacarLinha(numeroSerie)` | Destacar na tabela a linha do computador encontrado | ★★☆ |
| 5 | `venderComputador(numeroSerie)` | Registar a venda **sem permitir vender duas vezes** (o problema do desafio) | ★★★ |

### Testes que têm de passar

| Pesquisa | Resultado esperado |
|---|---|
| *(campo vazio)* | Aviso: «Introduza um número de série.» |
| `INF-2026-0001` | Sucesso: disponível para venda, ficha visível, linha destacada |
| `  inf-2026-0001 ` | Igual ao anterior (espaços e minúsculas são aceites) |
| `INF-2026-0004` | Informação: em manutenção, ainda não pode ser vendido |
| `INF-2026-0003` | Aviso: já foi vendido |
| `INF-2026-0006` | Erro: abatido ao inventário |
| `INF-9999-0000` | Erro: não existe nenhum computador com esse número de série |
| Vender `INF-2026-0001` duas vezes | 1.ª vez: venda registada · 2.ª vez: venda **recusada** |

### Conceitos

Arrays e objetos · ciclo `for...of` · `.find()` · `if / else if` · `trim()` / `toUpperCase()` · `classList` · `dataset`

### Extras (opcional)

- Mostrar, por cima da tabela, quantos computadores há em cada estado.
- Pedir confirmação antes de registar a venda (`confirm()`).
- Adicionar um botão «Abater» que muda o estado para *Abatido*.

---

## Desafio 03 — «Qualquer pessoa pode entrar na gestão»

### Contexto

A página de gestão do marketplace abre a quem souber o endereço, sem pedir palavra-passe. É preciso protegê-la com um login **sem estragar o que já funcionava**.

### Como funciona a aplicação

A aplicação tem quatro «ecrãs» na mesma página, escolhidos pelo endereço:

| Endereço | Ecrã | Quem deve poder ver |
|---|---|---|
| `index.html#login` | Login | Toda a gente |
| `index.html#consulta` | Consulta (preço, características) | Quem fez login (qualquer perfil) |
| `index.html#gestao` | Gestão (custo, margem, fornecedor) | **Só administradores** |
| *(ecrã «negado»)* | Acesso negado | Aparece quando o acesso é recusado |

Sempre que o endereço muda, é chamada a função `router()`.

**O problema:** abre a página e carrega em «Abrir `index.html#gestao` sem login». A gestão abre!

### Credenciais de teste

| Utilizador | Palavra-passe | Perfil |
|---|---|---|
| `admin` | `Admin#2026` | Administrador |
| `gestor` | `Gestor#2026` | Administrador |
| `joao` | `Joao#2026` | Utilizador |
| `maria` | `Maria#2026` | Utilizador |

### O que já está feito

- Ecrã de login com o botão «Mostrar/Esconder» palavra-passe, ecrãs de consulta, de gestão e de acesso negado.
- Lista de contas e de produtos (com dados públicos e dados internos separados).
- Barra de sessão no cabeçalho (nome, perfil e botão *Terminar sessão*).
- Funções prontas: `mostrarEcra(nome)`, `mostrarMensagem(zona, tipo, texto)`, `mostrarAcessoNegado(motivo, destino)`, `atualizarBarraSessao()`.

### Tarefas

| TODO | Função | O que fazer | Dificuldade |
|---|---|---|---|
| 1 | `camposPreenchidos(utilizador, palavraPasse)` | Verificar se os dois campos estão preenchidos | ★☆☆ |
| 2 | `verificarCredenciais(utilizador, palavraPasse)` | Procurar a conta; o utilizador não distingue maiúsculas, a palavra-passe distingue | ★★☆ |
| 3 | `fazerLogin(evento)` | Validar, autenticar, guardar a sessão e encaminhar conforme o perfil | ★★☆ |
| 4 | `abrirGestao()` | **Proteger a gestão:** sem login → negado; perfil utilizador → negado | ★★☆ |
| 5 | `abrirConsulta()` | Proteger a consulta: só com login | ★☆☆ |
| 6 | `terminarSessao()` | Terminar a sessão e voltar ao login | ★☆☆ |

### Testes que têm de passar

| Ação | Resultado esperado |
|---|---|
| Entrar com os campos vazios | Aviso: preencher os campos |
| `joao` / `joao#2026` | Erro: «Acesso negado: utilizador ou palavra-passe incorretos.» |
| `JOAO` / `Joao#2026` | Acesso autorizado → ecrã **Consulta** |
| Com `joao`, clicar em «Gestão» | **Acesso negado:** sem permissão |
| `admin` / `Admin#2026` | Acesso autorizado → ecrã **Gestão** |
| Abrir `index.html#gestao` **sem login** | **Acesso negado:** tem de iniciar sessão |
| Terminar sessão e voltar a abrir `#gestao` | **Acesso negado** |

> **Teste «antes e depois»:** antes de começarem, registem numa folha o que acontece ao abrir `#gestao` sem login. Repitam no fim e anotem a diferença.

### Conceitos

Validação de formulários · pesquisa num array de objetos · operadores `&&` / `||` · variável de estado (`utilizadorAtual`) · perfis e permissões · `location.hash`

### Extras (opcional)

- Bloquear o login durante 30 segundos após 3 tentativas falhadas.
- Guardar a sessão em `sessionStorage` para não se perder ao atualizar a página (e explicar o que é uma sessão).
- Mostrar o link «Gestão» no menu apenas a administradores. **Atenção:** isto não substitui o TODO 4. Porquê?

---

## Desafio 05 — «E se fossem 300 computadores?»

### Contexto

Com trinta equipamentos, uma lista simples chega. A Inforlandia quer saber se a solução aguenta **trezentos**. Com 300 linhas, ninguém encontra nada a olho: é preciso **pesquisar, filtrar, ordenar e ver totais**.

### O que já está feito

- **Gerador automático** de 300 computadores fictícios (`gerarComputadores`). Gera sempre os mesmos dados, por isso todos na turma veem os mesmos resultados.
- O array principal chama-se `inventario`. Escreve `inventario` ou `inventario[0]` na consola para o explorares.
- Tabela com as 300 linhas, cartões de estatísticas (vazios), caixa de pesquisa, filtro de estado e ordenação.
- A função `aplicarFiltros()` já liga tudo: pesquisa → filtro → ordenação → tabela. Cada uma dessas funções está, por agora, a devolver a lista sem alterações.

### Tarefas

| TODO | Função | O que fazer | Dificuldade |
|---|---|---|---|
| 1 | `atualizarEstatisticas()` | Contar o total, os disponíveis, os em manutenção e os vendidos | ★☆☆ |
| 2 | `pesquisarPorSerie(lista, texto)` | Devolver os computadores cujo número de série **contém** o texto | ★★☆ |
| 3 | `filtrarPorEstado(lista, estado)` | Devolver só os computadores com esse estado (`"todos"` = sem filtro) | ★☆☆ |
| 4 | `ordenarComputadores(lista, criterio)` | Ordenar por série, marca, preço (crescente ou decrescente) ou data | ★★★ |
| 5 | `mostrarResultados(quantidade)` | Mostrar «A mostrar X de 300» e um aviso quando não há resultados | ★☆☆ |
| 6 | `limparFiltros()` | Repor a pesquisa, o filtro e a ordenação iniciais | ★☆☆ |

### Testes que têm de passar

| Ação | Resultado esperado |
|---|---|
| Abrir a página | Cartões com Total **300**, Disponíveis **172**, Em manutenção **59**, Vendidos **48** |
| Pesquisar `hp` | **57** computadores (todos HP) |
| `hp` + estado «Disponível» | **33** computadores |
| Ordenar por «Preço (mais caro)» | O primeiro custa **576,00 €** |
| Pesquisar `zzz` | «A mostrar 0 de 300» e mensagem de aviso |
| «Limpar filtros» | Volta a mostrar 300, ordenados por número de série (`ACE-2026-0001` primeiro) |
| Combinar pesquisa + estado + ordenação | Os três funcionam em conjunto |

### Conceitos

Arrays de objetos · `.filter()` · `.sort()` com função de comparação · cópia de arrays (`[...lista]`) · `.includes()` · `localeCompare()` · contadores

### Extras (opcional)

- **Paginação:** mostrar 25 computadores de cada vez, com botões «Anterior» / «Seguinte».
- **Medir o tempo:** usar `performance.now()` para medir quanto demora `aplicarFiltros()`. Mudar `TOTAL_COMPUTADORES` para 3000 e para 30 000 e comparar.
- Ordenar ao clicar no cabeçalho de uma coluna.
- Um cartão extra com o **valor total** do stock disponível (soma dos preços).
- Um filtro por marca.

---

## Ligação aos blocos do SkillLABS

Estes projetos são uma base para a parte de programação de cada desafio. Podem ser usados na demonstração do Bloco A e discutidos no Bloco B:

- **Desafio 2:** o campo que guarda o estado do equipamento, o que muda quando é vendido e porque é que uma página desatualizada deixa vender duas vezes.
- **Desafio 3:** dados públicos e dados internos, onde se define que só entra quem fez login, e o teste antes e depois.
- **Desafio 5:** o que muda quando há centenas de produtos (listagem, pesquisa, carregamento), o que é *client-side* e o que teria de passar para *server-side*.

### Perguntas para discutir em grupo

1. Neste projeto, onde estão guardados os dados? O que acontece quando se atualiza a página? E se fossem dois funcionários em dois computadores diferentes?
2. No desafio 3, porque é que esconder o botão «Gestão» não chega para proteger a página?
3. No desafio 5, a solução que fizeram continuaria a funcionar com 30 000 computadores? Como sabem?
