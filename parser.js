
let tokens;
let i;

function parse(sourceTokens) {
  tokens = sourceTokens;
  i = 0;
  const body = parseStatements();
  return { type: "program", body };
}

function parseStatements() {
  const statements = [];
  while (i < tokens.length && tokens[i] !== "}") {
    statements.push(parseStatement());
  }
  return statements;
}

function consume(expected) {
  if (tokens[i] !== expected) {
    throw new Error("Esperado " + expected + " mas recebi " + tokens[i]);
  }
  i++;
}

function parseStatement() {
  if (tokens[i] === "fun") {
    i++;
    const name = tokens[i++];
    consume("(");
    const params = [];
    if (tokens[i] !== ")") {
      params.push(tokens[i++]);
      while (tokens[i] === ",") {
        i++;
        params.push(tokens[i++]);
      }
    }
    consume(")");
    consume("{");
    const body = parseStatements();
    consume("}");
    return { type: "function", name, params, body };
  }

  if (tokens[i] === "if") {
    i++;
    consume("(");
    const test = parseExpression();
    consume(")");
    consume("{");
    const consequent = parseStatements();
    consume("}");
    let alternate = null;
    if (tokens[i] === "else") {
      i++;
      consume("{");
      alternate = parseStatements();
      consume("}");
    }
    return { type: "if", test, consequent, alternate };
  }

  if (tokens[i] === "for") {
    i++;
    consume("(");
    const init = parseStatement();
    const test = parseExpression(); consume(";");
    const update = parseStatement();
    consume(")");
    consume("{");
    const body = parseStatements();
    consume("}");
    return { type: "for", init, test, update, body };
  }

  if (tokens[i] === "while") {
    i++;
    consume("(");
    const test = parseExpression();
    consume(")");
    consume("{");
    const body = parseStatements();
    consume("}");
    return { type: "while", test, body };
  }

  if (tokens[i] === "return") {
    i++;
    const argument = parseExpression();
    consume(";");
    return { type: "return", argument };
  }

  if (tokens[i] === "print") {
    i++;
    const value = parseExpression();
    consume(";");
    return { type: "print", value };
  }

  if (tokens[i] === "read") {
    i++;
    const id = tokens[i++];
    consume(";");
    return { type: "read", id };
  }

  // assignment or call
  const id = tokens[i++];
  if (tokens[i] === "=") {
    i++;
    const expr = parseExpression();
    consume(";");
    return { type: "assign", id, expr };
  }
  if (tokens[i] === "(") {
    i++;
    const args = [];
    if (tokens[i] !== ")") {
      args.push(parseExpression());
      while (tokens[i] === ",") {
        i++;
        args.push(parseExpression());
      }
    }
    consume(")");
    consume(";");
    return { type: "call", id, args };
  }

  throw new Error("Comando inválido na linha " + i + ": " + tokens[i]);
}

function parseExpression() {
  let left = parseComparison();
  while (tokens[i] === "&&" || tokens[i] === "||") {
    const op = tokens[i++];
    const right = parseComparison();
    left = { type: "binary", operator: op, left, right };
  }
  return left;
}

function parseComparison() {
  let left = parsePrimary();
  while (["==", "!=", "<", ">", "<=", ">="].includes(tokens[i])) {
    const op = tokens[i++];
    const right = parsePrimary();
    left = { type: "binary", operator: op, left, right };
  }
  return left;
}

function parsePrimary() {
  if (tokens[i] === "!") {
    i++;
    const right = parsePrimary();
    return { type: "unary", operator: "!", right };
  }

  if (tokens[i] === "(") {
    i++; // consome o "("
    const expr = parseExpression();
    if (tokens[i] !== ")") {
      throw new Error("Esperado ) mas recebi " + tokens[i]);
    }
    i++; // consome o ")"
    return expr;
  }

  // Booleanos
  if (tokens[i] === "true" || tokens[i] === "false") {
    return { type: "literal", value: tokens[i++] === "true" };
  }

  // Strings entre aspas
  if (/^"[^"]*"$/.test(tokens[i])) {
    return { type: "literal", value: tokens[i++].slice(1, -1) };
  }

  // Números inteiros
  if (/^\d+$/.test(tokens[i])) {
    return { type: "literal", value: Number(tokens[i++]) };
  }

  // Identificadores (variáveis)
  if (/^[A-Za-z_]\w*$/.test(tokens[i])) {
    return { type: "identifier", name: tokens[i++] };
  }

  throw new Error("Expressão inválida: " + tokens[i]);
}



module.exports = { parse };
