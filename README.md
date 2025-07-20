# Interpretador Micro C

## Integrantes

- Ana Luíza Fernandes Alves da Rocha – 211030667
- Ian Lucca Soares Mesquita - 211045140
- Tales Rodrigues Gonçalves - 211041295

## Introdução

Este projeto implementa um interpretador para uma linguagem fictícia chamada **Micro C**, inspirada na linguagem C, porém com sintaxe simplificada. O interpretador foi desenvolvido em JavaScript (Node.js) e suporta as seguintes construções:

- Tipos: `int`, `string`
- Entrada e saída: `read`, `print`
- Controle de fluxo: `if`, `else`, `while`, `for`
- Funções: `fun nome() { ... }` com suporte a `return`
- Comentários: `// comentário`
- Expressões aritméticas: `+`, `-`, `*`, `/`
- Expressões relacionais: `==`, `!=`, `<`, `<=`, `>`, `>=`

### Exemplo de código Micro C

```c
// Função de saudação
fun saudacao(nome) {
  print "Olá, ";
  print nome;
}

read nome;
saudacao(nome);

for (int i = 1; i <= 3; i = i + 1) {
  print "Contando:";
  print i;
}
````

## Instalação

### Requisitos:
Node.js (v18 ou superior).

### Passos:

```
git clone https://github.com/seu-usuario/micro-c-interpreter.git
cd micro-c-interpreter
npm install prompt-sync
node main.js
````
O interpretador irá executar o conteúdo do arquivo input.c.

## Estrutura do Código:

``` graphql
micro-c/
├── lexer.js           # Analisador léxico (tokenização)
├── parser.js          # Analisador sintático (AST)
├── interpreter.js     # Interpretador (execução da AST)
├── main.js            # Ponto de entrada (carrega e executa input.c)
├── input.c            # Código-fonte da linguagem Micro C
└── exemplos/          # Exemplos adicionais da linguagem
```

### Etapas da compilação:
1. **Análise léxica:** realizada em ```lexer.js```, que converte o código em tokens.
2. **Análise sintática:** realizada em ```parser.js```, que constrói a árvore de sintaxe abstrata (AST).
3. **Execução:** feita em ```interpreter.js```, que interpreta e executa os nós da AST.

## Bugs / Limitações / Problemas Conhecidos

- Não há análise semântica ou verificação de tipos complexos;
- Não há suporte a escopos aninhados nem funções anônimas;
- O interpretador é síncrono e linear (sem chamada assíncrona);
- Arrays e ponteiros não são suportados;
- A estrutura de controle é limitada ao necessário para os exemplos propostos.

### Futuras melhorias podem incluir suporte a:

- Escopos léxicos e variáveis locais por bloco.
- Suporte a tipos compostos como arrays e structs.
- Otimização de AST e implementação de ambiente de execução mais robusto.

## Referências

- Crafting Interpreters – Bob Nystrom: base conceitual para estrutura de interpretadores.
- Documentação oficial da linguagem C: sintaxe e estruturas base.
- MDN JavaScript: uso de estruturas como Map, Array, function, etc.
- As contribuições originais deste projeto incluem:
  - Implementação completa do parser e interpretador em JavaScript puro;
  - Suporte completo a funções com retorno, estruturas de repetição, entrada e saída;
  - Manipulação de strings e comentários inline.
