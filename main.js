
const fs = require("fs");
const lexer = require("./lexer");
const parser = require("./parser");
const interpret = require("./interpreter");

const source = fs.readFileSync("input.c", "utf-8");
const tokens = lexer.tokenize(source);
const ast = parser.parse(tokens);
interpret(ast);
