
function tokenize(code) {
  code = code.replace(/\/\/.*$/gm, ""); // Remove comentários
  const regex = /\s*(\"[^\"]*\"|=>|==|<=|>=|!=|[{}();=<>+\-*/]|[A-Za-z_]\w*|\d+)\s*/g;
  const tokens = [];
  let m;
  while ((m = regex.exec(code)) !== null) {
    tokens.push(m[1]);
  }
  return tokens;
}
module.exports = { tokenize };
