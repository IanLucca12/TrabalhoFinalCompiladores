
const prompt = require("prompt-sync")();

function interpret(ast) {
  const env = {};
  const functions = {};

  function evalExpr(expr, scope) {
    if (expr.type === "Literal") return expr.value;
    if (expr.type === "String") return expr.value;
    if (expr.type === "CallExpr") return callFunction(expr.name, expr.args, scope);
    const left = isNaN(expr.left) ? scope[expr.left] : Number(expr.left);
    const right = isNaN(expr.right) ? scope[expr.right] : Number(expr.right);
    switch (expr.op) {
      case "+": return left + right;
      case "-": return left - right;
      case "*": return left * right;
      case "/": return left / right;
    }
  }

  function evalCond(cond, scope) {
    const left = isNaN(cond.left) ? scope[cond.left] : Number(cond.left);
    const right = isNaN(cond.right) ? scope[cond.right] : Number(cond.right);
    switch (cond.op) {
      case "<": return left < right;
      case ">": return left > right;
      case "==": return left == right;
    }
  }

  function execBlock(stmts, scope) {
    for (const stmt of stmts) {
      const result = exec(stmt, scope);
      if (result && result.type === "Return") return result;
    }
  }

  function callFunction(name, args, parentScope) {
    const fn = functions[name];
    if (!fn) throw new Error("Função não definida: " + name);
    const fnScope = {};
    fn.params.forEach((param, index) => {
      fnScope[param] = isNaN(args[index]) ? parentScope[args[index]] : Number(args[index]);
    });
    const result = execBlock(fn.body, fnScope);
    if (result && result.type === "Return") {
      return evalExpr(result.value, fnScope);
    }
    return null;
  }

  function exec(stmt, scope = env) {
    switch (stmt.type) {
      case "Declaration":
        scope[stmt.name] = evalExpr(stmt.value, scope);
        break;
      case "Print":
        const val = stmt.value;
        console.log(val in scope ? scope[val] : val);
        break;
      case "Assignment":
        scope[stmt.name] = evalExpr(stmt.value, scope);
        break;
      case "While":
        while (evalCond(stmt.cond, scope)) execBlock(stmt.body, scope);
        break;
      case "If":
        if (evalCond(stmt.cond, scope)) {
          execBlock(stmt.thenBody, scope);
        } else if (stmt.elseBody) {
          execBlock(stmt.elseBody, scope);
        }
        break;
      case "For":
        exec(stmt.init, scope);
        while (evalCond(stmt.cond, scope)) {
          execBlock(stmt.body, scope);
          exec(stmt.inc, scope);
        }
        break;
      case "Function":
        functions[stmt.name] = stmt;
        break;
      case "Call":
        callFunction(stmt.name, stmt.args, scope);
        break;
      case "Return":
        return stmt;
      case "Read":
        const input = prompt(`Digite o valor de ${stmt.name}: `);
        scope[stmt.name] = isNaN(input) ? input : Number(input);
        break;
    }
  }

  for (const stmt of ast.body) {
    exec(stmt);
  }
}

module.exports = interpret;
