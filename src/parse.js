const P = require('parsimmon');

const Comment =
  P.regex(/;[^\n]*/)
    .skip(P.alt(P.string('\n'), P.eof))
    .desc('a comment');

const _ =
  P.alt(P.whitespace, Comment)
    .many()
    .desc('whitespace');

const SExp =
  P.lazy(() => P.alt(AList, Atom));

const AList =
  P.string('(')
    .then(_.then(SExp).skip(_).many())
    .skip(P.string(')'))
    .map(items => ({type: 'List', items}))
    .desc('a list');

const AString =
  P.string('"')
    // TODO: Accept escaped characters
    .then(P.regex(/[^"]*/))
    .skip(P.string('"'))
    // TODO: Convert escaped characters back
    .map(value => ({type: 'String', value}))
    .desc('a string');

const True =
  P.string('#t')
    .result({type: 'True'})
    .desc('#t');

const False =
  P.string('#f')
    .result({type: 'False'})
    .desc('#f');

const ANumber =
  P.regex(/-?[0-9]+/)
    .map(x => Number(x))
    .map(value => ({type: 'Number', value}))
    .desc('a number');

const ASymbol =
  P.regex(/[a-zA-Z_+=<>?\/-]+/)
    .map(name => ({type: 'Symbol', name}))
    .desc('a symbol');

const Quote =
  P.string('\'')
    .skip(_)
    .then(SExp)
    .map(sexp => ({
      type: 'List',
      items: [
        {type: 'Symbol', name: 'quote'},
        sexp
      ]
    }));

const Atom =
  P.alt(
    Quote,
    AString,
    ANumber,
    True,
    False,
    ASymbol
  );

const File =
  _.then(SExp).skip(_);

function parse(code) {
  return File.parse(code);
}

exports.parse = parse;
