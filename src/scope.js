const Empty = ['Scope.Empty'];

function create(parent, items) {
  return ['Scope.Nonempty', items, parent];
}

function lookup(scope, key) {
  if (scope[0] === 'Scope.Empty') {
    throw new Error('no such variable ' + key);
  } else if (scope[0] === 'Scope.Nonempty') {
    if (scope[1].hasOwnProperty(key)) {
      return scope[1][key];
    } else {
      return lookup(scope[2], key);
    }
  }
  throw new Error('not a valid scope');
}

function assign(scope, key, value) {
  if (scope[0] === 'Scope.Nonempty') {
    scope[1][key] = value;
  } else {
    throw new Error('not a valid scope to assign to');
  }
}

exports.assign = assign;
exports.lookup = lookup;
exports.create = create;
exports.Empty = Empty;
