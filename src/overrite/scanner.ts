/**
  The scanner provides an interface that takes a string of text as input, and
  outputs an array of tokens instances that can be used for easy URL parsing.

  @module linkify
  @submodule scanner
  @main scanner
*/

// @ts-ignore
import { CharacterState as State, stateify } from 'linkifyjs/lib/linkify/core/state';
// @ts-ignore
import * as TOKENS from 'linkifyjs/lib/linkify/core/tokens/text';
import { TLDS } from './tlds';
import {
  DOMAIN,
  LOCALHOST,
  NUM,
  PROTOCOL,
  MAILTO,
  TLD,
  WS,
  AT,
  DOT,
  PLUS,
  POUND,
  QUERY,
  SLASH,
  UNDERSCORE,
  COLON,
  OPENBRACE,
  OPENBRACKET,
  OPENANGLEBRACKET,
  OPENPAREN,
  CLOSEBRACE,
  CLOSEBRACKET,
  CLOSEANGLEBRACKET,
  CLOSEPAREN,
  AMPERSAND,
  PUNCTUATION,
  NL,
  SYM,
  // @ts-ignore
} from 'linkifyjs/lib/linkify/core/tokens/text';

export interface IBaseState {
  j: any[];
  T: any | null;
  defaultTransition: boolean | IBaseState;
  on: (symbol: string | string[] | RegExp | RegExp[], state: IBaseState) => IBaseState;
  next: (item: string) => IBaseState;
  accepts: () => boolean;
  test: (item: string, symbol: string) => boolean;
  emit: () => any | null;
}

const tlds = TLDS;

export const NUMBERS = '0123456789'.split('');
export const ALPHANUM = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
export const WHITESPACE = [' ', '\f', '\r', '\t', '\v', '\u00a0', '\u1680', '\u180e']; // excluding line breaks

let domainStates: any[] = []; // states that jump to DOMAIN on /[a-z0-9]/
let makeState = (tokenClass?: any): IBaseState => new State(tokenClass);

// Frequently used states
const S_START = makeState();
export const S_NUM = makeState(NUM);
export const S_DOMAIN = makeState(DOMAIN);
export const S_DOMAIN_HYPHEN = makeState(); // domain followed by 1 or more hyphen characters
export const S_WS = makeState(WS);

// States for special URL symbols
S_START
  .on('@', makeState(AT))
  .on('.', makeState(DOT))
  .on('+', makeState(PLUS))
  .on('#', makeState(POUND))
  .on('?', makeState(QUERY))
  .on('/', makeState(SLASH))
  .on('_', makeState(UNDERSCORE))
  .on(':', makeState(COLON))
  .on('{', makeState(OPENBRACE))
  .on('[', makeState(OPENBRACKET))
  .on('<', makeState(OPENANGLEBRACKET))
  .on('(', makeState(OPENPAREN))
  .on('}', makeState(CLOSEBRACE))
  .on(']', makeState(CLOSEBRACKET))
  .on('>', makeState(CLOSEANGLEBRACKET))
  .on(')', makeState(CLOSEPAREN))
  .on('&', makeState(AMPERSAND))
  .on([',', ';', '!', '"', '\''], makeState(PUNCTUATION));

// Whitespace jumps
// Tokens of only non-newline whitespace are arbitrarily long
S_START
  .on('\n', makeState(NL))
  .on(WHITESPACE, S_WS);

// If any whitespace except newline, more whitespace!
S_WS.on(WHITESPACE, S_WS);

// Generates states for top-level domains
// Note that this is most accurate when tlds are in alphabetical order
for (let i = 0; i < tlds.length; i++) {
  let newStates = stateify(tlds[i], S_START, TLD, DOMAIN);
  domainStates.push.apply(domainStates, newStates);
}

// Collect the states generated by different protocls
let partialProtocolFileStates = stateify('file', S_START, DOMAIN, DOMAIN);
let partialProtocolFtpStates = stateify('ftp', S_START, DOMAIN, DOMAIN);
let partialProtocolHttpStates = stateify('http', S_START, DOMAIN, DOMAIN);
let partialProtocolMailtoStates = stateify('mailto', S_START, DOMAIN, DOMAIN);

// Add the states to the array of DOMAINeric states
domainStates.push.apply(domainStates, partialProtocolFileStates);
domainStates.push.apply(domainStates, partialProtocolFtpStates);
domainStates.push.apply(domainStates, partialProtocolHttpStates);
domainStates.push.apply(domainStates, partialProtocolMailtoStates);

// Protocol states
let S_PROTOCOL_FILE = partialProtocolFileStates.pop();
let S_PROTOCOL_FTP = partialProtocolFtpStates.pop();
let S_PROTOCOL_HTTP = partialProtocolHttpStates.pop();
let S_MAILTO = partialProtocolMailtoStates.pop();
let S_PROTOCOL_SECURE = makeState(DOMAIN);
let S_FULL_PROTOCOL = makeState(PROTOCOL); // Full protocol ends with COLON
let S_FULL_MAILTO = makeState(MAILTO); // Mailto ends with COLON

// Secure protocols (end with 's')
S_PROTOCOL_FTP
  .on('s', S_PROTOCOL_SECURE)
  .on(':', S_FULL_PROTOCOL);

S_PROTOCOL_HTTP
  .on('s', S_PROTOCOL_SECURE)
  .on(':', S_FULL_PROTOCOL);

domainStates.push(S_PROTOCOL_SECURE);

// Become protocol tokens after a COLON
S_PROTOCOL_FILE.on(':', S_FULL_PROTOCOL);
S_PROTOCOL_SECURE.on(':', S_FULL_PROTOCOL);
S_MAILTO.on(':', S_FULL_MAILTO);

// Localhost
let partialLocalhostStates = stateify('localhost', S_START, LOCALHOST, DOMAIN);
domainStates.push.apply(domainStates, partialLocalhostStates);

// Everything else
// DOMAINs make more DOMAINs
// Number and character transitions
S_START.on(NUMBERS, S_NUM);
S_NUM
  .on('-', S_DOMAIN_HYPHEN)
  .on(NUMBERS, S_NUM)
  .on(ALPHANUM, S_DOMAIN); // number becomes DOMAIN

S_DOMAIN
  .on('-', S_DOMAIN_HYPHEN)
  .on(ALPHANUM, S_DOMAIN);

// All the generated states should have a jump to DOMAIN
for (let i = 0; i < domainStates.length; i++) {
  domainStates[i]
    .on('-', S_DOMAIN_HYPHEN)
    .on(ALPHANUM, S_DOMAIN);
}

S_DOMAIN_HYPHEN
  .on('-', S_DOMAIN_HYPHEN)
  .on(NUMBERS, S_DOMAIN)
  .on(ALPHANUM, S_DOMAIN);

// Set default transition
S_START.defaultTransition = makeState(SYM);

/**
  Given a string, returns an array of TOKEN instances representing the
  composition of that string.

  @method run
  @param {String} str Input string to scan
  @return {Array} Array of TOKEN instances
*/
let run = function (str: string) {

  // The state machine only looks at lowercase strings.
  // This selective `toLowerCase` is used because lowercasing the entire
  // string causes the length and character position to vary in some in some
  // non-English strings. This happens only on V8-based runtimes.
  let lowerStr = str.replace(/[A-Z]/g, (c) => c.toLowerCase());
  let len = str.length;
  let tokens = []; // return value

  var cursor = 0;

  // Tokenize the string
  while (cursor < len) {
    let state = S_START;
    let nextState = null;
    let tokenLength = 0;
    let latestAccepting = null;
    let sinceAccepts = -1;

    while (cursor < len && (nextState = state.next(lowerStr[cursor]))) {
      state = nextState;

      // Keep track of the latest accepting state
      if (state.accepts()) {
        sinceAccepts = 0;
        latestAccepting = state;
      } else if (sinceAccepts >= 0) {
        sinceAccepts++;
      }

      tokenLength++;
      cursor++;
    }

    if (sinceAccepts < 0) { continue; } // Should never happen

    // Roll back to the latest accepting state
    cursor -= sinceAccepts;
    tokenLength -= sinceAccepts;

    // Get the class for the new token
    // @ts-ignore
    let TOKEN = latestAccepting.emit(); // Current token class

    // No more jumps, just make a new token
    tokens.push(new TOKEN(str.substr(cursor - tokenLength, tokenLength)));
  }

  return tokens;
};

let start = S_START;
export {
  State,
  TOKENS,
  run,
  start
};
