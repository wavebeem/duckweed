const chalk = require('chalk');

function showSexp(sexp) {
  switch (sexp.type) {
  case 'Number':
    return chalk.yellow(JSON.stringify(sexp.value));
  case 'True':
    return chalk.magenta('#t');
  case 'False':
    return chalk.magenta('#f');
  case 'String':
    return chalk.red(JSON.stringify(sexp.value));
  case 'Symbol':
    return chalk.bold(sexp.name);
  case 'List':
    const items = sexp.items.map(showSexp).join(' ');
    return chalk.cyan('(') + items + chalk.cyan(')');
  default:
    throw new Error('cannot show sexp ' + JSON.stringify(sexp));
  }
}

exports.showSexp = showSexp;
