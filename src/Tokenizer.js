const { Token } = require('./Token')

const Spec = [

  [/^\s+/, null], // whitespace
  [/^\/\/.*/, null], // comments
  [/^\/\*[\s\S]*?\*\//, null], // comments

  [/^;/, ';'], // delimiters
  [/^{/, '{'],
  [/^}/, '}'],
  [/^\(/, '('],
  [/^\)/, ')'],
  [/^,/, ','], // comma

  // ------------------------ KEYWORDS
  [/^\blet\b/, 'let'],
  [/^\bif\b/, 'if'],
  [/^\belse\b/, 'else'],
  [/^\btrue\b/, 'true'],
  [/^\bfalse\b/, 'false'],
  [/^\bnull\b/, 'null'],

  // ------------------------ NUMBERS
  [/^\d+/, 'NUMBER'],
  [/^\w+/, 'IDENTIFIER'],

  // ------------------------ Equality
  [/^[=!]=/, 'EQUALITY_OPERATOR'],

  // ------------------------ Assignments
  [/^=/, 'SIMPLE_ASSIGN'],
  [/^[\*\/\+\-]=/, 'COMPLEX_ASSIGN'],

  [/^[+\-]/, 'ADDITIVE_OPERATOR'],
  [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'],
  [/^[><]=?/, 'RELATIONAL_OPERATOR'],

  [/^"[^"]*"/, 'STRING'],
  [/^'[^']*'/, 'STRING']
]

class Tokenizer {
  init (string) {
    this._string = string
    this._cursor = 0
  }

  hasMoreTokens () {
    return this._cursor < this._string.length
  }

  getNextToken () {
    if (this.hasMoreTokens() === false) { return null }

    const cursorStartPos = this._cursor
    const string = this._string.slice(this._cursor)
    for (const [regexp, tokenType] of Spec) {
      const tokenValue = this._match(regexp, string)
      // could not match this regexp -> continuing to next regexp
      if (tokenValue == null) { continue }

      if (tokenType == null) { // skipping whitespace, comments
        return this.getNextToken()
      }

      return new Token(tokenType, tokenValue, cursorStartPos, this._cursor)
    }

    throw new SyntaxError(`Unexpected token at ${string[0]}`)
  }

  _match (regexp, string) {
    const matched = regexp.exec(string)
    if (matched == null) return null

    this._cursor += matched[0].length
    return matched[0]
  }
}

module.exports = {
  Tokenizer
}
