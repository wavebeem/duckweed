const Scope = require('./scope');
const U = require('./util')
const E = require('./evaluate');

const TRUE = {type: 'True'};
const FALSE = {type: 'False'};

function NUMBER(value) {
  return {type: 'Number', value};
}

function print(stack, scope, x) {
  console.log(U.showSexp(x));
  return x;
}

function add(stack, scope, a, b) {
  return NUMBER(a.value + b.value);
}

function subtract(stack, scope, a, b) {
  return NUMBER(a.value - b.value);
}

function multiply(stack, scope, a, b) {
  return NUMBER(a.value * b.value);
}

function lessThan(stack, scope, a, b) {
  return a.value < b.value ? TRUE : FALSE;
}

function evaluate(stack, scope, sexp) {
  return E.EVAL(stack, scope, sexp);
}

const api = {
  print,
  '+': add,
  '-': subtract,
  '*': multiply,
  '<': lessThan,
  eval: evaluate
};

Object.keys(api).forEach(k => {
  api[k] = {type: 'JSFunction', f: api[k]}
});

const globals = Scope.create(Scope.Empty, api);

exports.globals = globals;
