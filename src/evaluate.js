const Scope = require('./scope');

const special = {
  quote(staack, scope, node) {
    if (node.items.length !== 2) {
      throw new Error('bad quote syntax');
    }
    return node.items[1];
  },
  list(stack, scope, node) {
    const items = node.items.slice(1).map(x => EVAL(stack, scope, x));
    return {type: 'List', items};
  },
  lambda(stack, scope, node) {
    const parameters = node.items[1];
    const body = node.items.slice(2);
    return {type: 'Function', scope, parameters, body};
  },
  let(stack, scope, node) {
    const obj = {};
    const pairs = node.items[1];
    pairs.items.forEach(p => {
      const name = p.items[0].name;
      const value = EVAL(stack, scope, p.items[1]);
      obj[name] = value;
    });
    const newScope = Scope.create(scope, obj);
    const values =
      node
        .items
        .slice(2)
        .map(x => EVAL(scope, newScope, x));
    return values[values.length - 1];
  }
};

const table = {
  List(stack, scope, node) {
    const first = node.items[0];
    // Evaluate special form such as `if` or `lambda`
    if (first.type === 'Symbol' && special.hasOwnProperty(first.name)) {
      return special[first.name](stack, scope, node);
    // Regular funciton call
    } else {
      const f = EVAL(stack, scope, first);
      const args = node
        .items
        .slice(1)
        .map(x => EVAL(stack, scope, x));
      if (f.type === 'JSFunction') {
        const args2 = [stack, scope].concat(args);
        return f.f.apply(null, args2);
      } else if (f.type === 'Function') {
        const newStack = stack.concat(['#<lambda>']);
        const obj = {};
        f.parameters.items.forEach((p, i) => {
          obj[p.name] = args[i];
        });
        const newScope = Scope.create(f.scope, obj);
        const values = f.body.map(x => EVAL(newScope, newScope, x));
        return values[values.length - 1];
      }
      throw new Error('cannot call non-function');
    }
  },
  True(stack, scope, node) {
    return node;
  },
  False(stack, scope, node) {
    return node;
  },
  String(stack, scope, node) {
    return node;
  },
  Number(stack, scope, node) {
    return node;
  },
  Symbol(stack, scope, node) {
    return Scope.lookup(scope, node.name);
  }
};

function EVAL(stack, scope, node) {
  if (table.hasOwnProperty(node.type)) {
    return table[node.type](stack, scope, node);
  }
  throw new Error('cannot evaluate ' + JSON.stringify(node));
}

function evaluate(scope, node) {
  return EVAL([], scope, node);
}

exports.EVAL = EVAL;
exports.evaluate = evaluate;
