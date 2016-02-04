const fs = require('fs');
const util = require('util');
const parse = require('./parse').parse;
const evaluate = require('./evaluate').evaluate;
const globals = require('./globals').globals;
const Scope = require('./scope');
const U = require('./util');

const args = process.argv.slice(2);
const filename = args[0];
const code = fs.readFileSync(filename, 'utf-8');

const opts = {colors: true, depth: null};
function show(x) {
  return console.log(util.inspect(x, opts));
}

const result = parse(code);
if (result.status) {
  const ast = result.value;
  // show(ast);
  console.log(U.showSexp(ast));
  console.log();
  const x = evaluate(globals, ast);
  console.log(U.showSexp(x));
} else {
  console.error('parse error!');
  console.error(result);
}
