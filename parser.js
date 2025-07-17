
function parse(tokens) {
  let i = 0;

  function consume(expected) {
    if (tokens[i] === expected) return tokens[i++];
    throw new Error("Esperado " + expected + " mas recebi " + tokens[i]);
  }

  function parseStatements() {
    const stmts = [];
    while (i < tokens.length) {
      stmts.push(parseStatement());
    }
    return { type: "Program", body: stmts };
  }

  function parseStatement() {
    if (tokens[i] === "int") {
      i++; const name = tokens[i++]; consume("="); const value = parseExpression(); consume(";");
      return { type: "Declaration", name, value };
    } else if (tokens[i] === "print") {
      i++; const value = tokens[i++]; consume(";");
      return { type: "Print", value };
    } else if (tokens[i] === "read") {
      i++; const name = tokens[i++]; consume(";");
      return { type: "Read", name };
    } else if (tokens[i] === "if") {
      i++; consume("("); const cond = parseCondition(); consume(")");
      consume("{");
      const thenBody = [];
      while (tokens[i] !== "}") thenBody.push(parseStatement());
      consume("}");
      let elseBody = null;
      if (tokens[i] === "else") {
        i++; consume("{");
        elseBody = [];
        while (tokens[i] !== "}") elseBody.push(parseStatement());
        consume("}");
      }
      return { type: "If", cond, thenBody, elseBody };
    } else if (tokens[i] === "while") {
      i++; consume("("); const cond = parseCondition(); consume(")");
      consume("{");
      const body = [];
      while (tokens[i] !== "}") body.push(parseStatement());
      consume("}");
      return { type: "While", cond, body };
    } else if (tokens[i] === "for") {
      i++; consume("(");
      const init = parseStatement();
      const cond = parseCondition(); consume(";");
      const inc = parseStatement();
      consume(")");
      consume("{");
      const body = [];
      while (tokens[i] !== "}") body.push(parseStatement());
      consume("}");
      return { type: "For", init, cond, inc, body };
    } else if (tokens[i] === "fun") {
      i++; const name = tokens[i++];
      consume("(");
      const params = [];
      while (tokens[i] !== ")") {
        params.push(tokens[i++]);
        if (tokens[i] === ",") i++;
      }
      consume(")");
      consume("{");
      const body = [];
      while (tokens[i] !== "}") body.push(parseStatement());
      consume("}");
      return { type: "Function", name, params, body };
    } else if (tokens[i] === "return") {
      i++; const value = parseExpression(); consume(";");
      return { type: "Return", value };
    } else if (/^[a-zA-Z_]\w*$/.test(tokens[i])) {
      const name = tokens[i++];
      if (tokens[i] === "=") {
        consume("="); const value = parseExpression(); consume(";");
        return { type: "Assignment", name, value };
      } else if (tokens[i] === "(") {
        i++; const args = [];
        while (tokens[i] !== ")") {
          args.push(tokens[i++]);
          if (tokens[i] === ",") i++;
        }
        consume(")"); consume(";");
        return { type: "Call", name, args };
      }
    }
  }

  function parseCondition() {
    const left = tokens[i++]; const op = tokens[i++]; const right = tokens[i++];
    return { type: "Condition", left, op, right };
  }

  function parseExpression() {
    if (/^".*"$/.test(tokens[i])) {
      return { type: "String", value: tokens[i++].slice(1, -1) };
    } else if (/^[0-9]+$/.test(tokens[i])) {
      return { type: "Literal", value: Number(tokens[i++]) };
    } else if (/^[a-zA-Z_]\w*$/.test(tokens[i]) && tokens[i + 1] === "(") {
      const name = tokens[i++];
      i++; const args = [];
      while (tokens[i] !== ")") {
        args.push(tokens[i++]);
        if (tokens[i] === ",") i++;
      }
      consume(")");
      return { type: "CallExpr", name, args };
    } else {
      const left = tokens[i++]; const op = tokens[i++]; const right = tokens[i++];
      return { type: "Expression", left, op, right };
    }
  }

  return parseStatements();
}

module.exports = { parse };
