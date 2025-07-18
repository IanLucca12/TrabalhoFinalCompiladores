
const prompt = require("prompt-sync")();

function interpret(node, env = {}) {
  switch (node.type) {
    case "program":
      for (const stmt of node.body) interpret(stmt, env);
      break;

    case "function":
      env[node.name] = { params: node.params, body: node.body };
      break;

    case "call":
      const fn = env[node.id];
      const local = { ...env };
      node.args.forEach((arg, idx) => {
        local[fn.params[idx]] = evaluate(arg, env);
      });
      for (const stmt of fn.body) {
        const result = interpret(stmt, local);
        if (result && result.return !== undefined) {
          return result;
        }
      }
      break;

    case "if":
      if (evaluate(node.test, env)) {
        for (const stmt of node.consequent) interpret(stmt, env);
      } else if (node.alternate) {
        for (const stmt of node.alternate) interpret(stmt, env);
      }
      break;

    case "for":
      interpret(node.init, env);
      while (evaluate(node.test, env)) {
        for (const stmt of node.body) interpret(stmt, env);
        interpret(node.update, env);
      }
      break;

    case "while":
      while (evaluate(node.test, env)) {
        for (const stmt of node.body) interpret(stmt, env);
      }
      break;

    case "assign":
      env[node.id] = evaluate(node.expr, env);
      break;

    case "print":
      console.log(evaluate(node.value, env));
      break;

    case "read":
      const input = prompt(`Digite o valor de ${node.id}: `);
      env[node.id] = isNaN(input) ? input : Number(input);
      break;

    case "return":
      return { return: evaluate(node.argument, env) };

    default:
      throw new Error("Tipo de instrução desconhecido: " + node.type);
  }
}

function evaluate(expr, env) {
  switch (expr.type) {
    case "literal":
      return expr.value;

    case "identifier":
      return env[expr.name];

    case "binary":
      const left = evaluate(expr.left, env);
      const right = evaluate(expr.right, env);
      switch (expr.operator) {
        case "+": return left + right;
        case "-": return left - right;
        case "*": return left * right;
        case "/": return left / right;
        case "%": return left % right;
        case "==": return left === right;
        case "!=": return left !== right;
        case "<": return left < right;
        case "<=": return left <= right;
        case ">": return left > right;
        case ">=": return left >= right;
        case "&&": return left && right;
        case "||": return left || right;
        default: throw new Error("Operador binário desconhecido: " + expr.operator);
      }

    case "unary":
      const val = evaluate(expr.right, env);
      switch (expr.operator) {
        case "!": return !val;
        default: throw new Error("Operador unário desconhecido: " + expr.operator);
      }

    default:
      throw new Error("Expressão inválida: " + expr.type);
  }
}

module.exports = interpret;
