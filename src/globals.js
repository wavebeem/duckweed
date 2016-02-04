const Scope = require('./scope');
const U = require('./util')
const E = require('./evaluate');

function print(stack, scope, x) {
  console.log(U.showSexp(x));
  return x;
}

function add(stack, scope, a, b) {
  return {type: 'Number', value: a.value + b.value};
}

function evaluate(stack, scope, sexp) {
  return E.EVAL(stack, scope, sexp);
}

const api = {
  print,
  '+': add,
  eval: evaluate
};

Object.keys(api).forEach(k => {
  api[k] = {type: 'JSFunction', f: api[k]}
});

const globals = Scope.create(Scope.Empty, api);

exports.globals = globals;
