// @ts-ignore
import { createTokenClass } from 'linkifyjs/lib/linkify/core/tokens/create-token-class';
import { inherits } from '../utils';

/******************************************************************************
  Text Tokens
  Tokens composed of strings
******************************************************************************/

/**
  Abstract class used for manufacturing text tokens.
  Pass in the value this token represents

  @class TextToken
  @abstract
*/
export const TextToken = createTokenClass();
TextToken.prototype = {
  toString() {
    return this.v + '';
  }
};


export function inheritsToken(value?: string) {
  var props = value ? { v: value } : {};
  return inherits(TextToken, createTokenClass(), props);
}

/**
  A valid domain token
  @class DOMAIN
  @extends TextToken
*/
const DOMAIN = inheritsToken();

/**
  @class AT
  @extends TextToken
*/
const AT = inheritsToken('@');

/**
  Represents a single colon `:` character

  @class COLON
  @extends TextToken
*/
const COLON = inheritsToken(':');

/**
  @class DOT
  @extends TextToken
*/
const DOT = inheritsToken('.');

/**
  @class EXCLAMATION_MARK
  @extends TextToken
 */
export const EXCLAMATION_MARK = inheritsToken('!');

/**
  A character class that can surround the URL, but which the URL cannot begin
  or end with. Does not include certain English punctuation like parentheses.

  @class PUNCTUATION
  @extends TextToken
*/
const PUNCTUATION = inheritsToken();

/**
  The word localhost (by itself)
  @class LOCALHOST
  @extends TextToken
*/
const LOCALHOST = inheritsToken();

/**
  Newline token
  @class NL
  @extends TextToken
*/
const NL = inheritsToken('\n');

/**
  @class NUM
  @extends TextToken
*/
const NUM = inheritsToken();

/**
  @class PLUS
  @extends TextToken
*/
const PLUS = inheritsToken('+');

/**
  @class POUND
  @extends TextToken
*/
const POUND = inheritsToken('#');

/**
  Represents a web URL protocol. Supported types include

  * `http:`
  * `https:`
  * `ftp:`
  * `ftps:`

  @class PROTOCOL
  @extends TextToken
*/
const PROTOCOL = inheritsToken();

/**
  Represents the start of the email URI protocol

  @class MAILTO
  @extends TextToken
*/
const MAILTO = inheritsToken('mailto:');

/**
  @class QUERY
  @extends TextToken
*/
const QUERY = inheritsToken('?');

/**
  @class SLASH
  @extends TextToken
*/
const SLASH = inheritsToken('/');

/**
  @class UNDERSCORE
  @extends TextToken
*/
const UNDERSCORE = inheritsToken('_');

/**
  One ore more non-whitespace symbol.
  @class SYM
  @extends TextToken
*/
const SYM = inheritsToken();

/**
  @class TLD
  @extends TextToken
*/
const TLD = inheritsToken();

/**
  Represents a string of consecutive whitespace characters

  @class WS
  @extends TextToken
*/
const WS = inheritsToken();

/**
  Opening/closing bracket classes
*/

const OPENBRACE = inheritsToken('{');
const OPENBRACKET = inheritsToken('[');
const OPENANGLEBRACKET = inheritsToken('<');
const OPENPAREN = inheritsToken('(');
const CLOSEBRACE = inheritsToken('}');
const CLOSEBRACKET = inheritsToken(']');
const CLOSEANGLEBRACKET = inheritsToken('>');
const CLOSEPAREN = inheritsToken(')');

const AMPERSAND = inheritsToken('&');

export {
  TextToken as Base,
  DOMAIN,
  AT,
  COLON,
  DOT,
  PUNCTUATION,
  LOCALHOST,
  NL,
  NUM,
  PLUS,
  POUND,
  QUERY,
  PROTOCOL,
  MAILTO,
  SLASH,
  UNDERSCORE,
  SYM,
  TLD,
  WS,
  OPENBRACE,
  OPENBRACKET,
  OPENANGLEBRACKET,
  OPENPAREN,
  CLOSEBRACE,
  CLOSEBRACKET,
  CLOSEANGLEBRACKET,
  CLOSEPAREN,
  AMPERSAND
};
