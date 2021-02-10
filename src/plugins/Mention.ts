import { BasePlugin } from './Base';
import { LinkifyCore } from '@/Core';
import { IBaseState } from '../overrite/scanner';


export interface MentionPluginInit {
  S_AT: IBaseState;
  S_AT_SYMS: IBaseState;
  S_MENTION: IBaseState;
  S_MENTION_DIVIDER: IBaseState;
  S_MENTION_DIVIDER_SYMS: IBaseState;
}

/**
  Mention parser plugin for linkify
*/
export class MentionPlugin extends BasePlugin<MentionPluginInit> {

  init(linkify: typeof LinkifyCore): MentionPluginInit {
    const TT = linkify.scanner.TOKENS;
    const { State } = linkify.parser;
    const S_START = linkify.parser.start;

    return {
      S_AT: S_START.jump(TT.AT), // @
      S_AT_SYMS: new State(),
      S_MENTION: new State(this.StateStorage),
      S_MENTION_DIVIDER: new State(),
      S_MENTION_DIVIDER_SYMS: new State(),
    };
  }

  startEnable(linkify: typeof LinkifyCore, inited: MentionPluginInit): void {
    const { TOKENS: { Base: MultiToken }, State } = linkify.parser; // Multi tokens, state

    const TT = linkify.scanner.TOKENS; // Text tokens
    const TT_DOMAIN = TT.DOMAIN;
    const TT_LOCALHOST = TT.LOCALHOST;
    const TT_NUM = TT.NUM;
    const TT_SLASH = TT.SLASH;
    const TT_TLD = TT.TLD;
    const TT_UNDERSCORE = TT.UNDERSCORE;
    const TT_DOT = TT.DOT;
    const TT_AT = TT.AT;

    const {
      S_AT,
      S_AT_SYMS,
      S_MENTION,
      S_MENTION_DIVIDER,
      S_MENTION_DIVIDER_SYMS,
    } = inited;

    linkify.inherits(MultiToken, this.StateStorage, {
      type: 'mention',
      isLink: true,
      toHref() {
        return '/' + this.toString().substr(1);
      }
    });


    // @_,
    S_AT.on(TT_UNDERSCORE, S_AT_SYMS);

    //  @_*
    S_AT_SYMS
      .on(TT_UNDERSCORE, S_AT_SYMS)
      .on(TT_DOT, S_AT_SYMS);

    // Valid mention (not made up entirely of symbols)
    S_AT
      .on(TT_DOMAIN, S_MENTION)
      .on(TT_LOCALHOST, S_MENTION)
      .on(TT_TLD, S_MENTION)
      .on(TT_NUM, S_MENTION);

    S_AT_SYMS
      .on(TT_DOMAIN, S_MENTION)
      .on(TT_LOCALHOST, S_MENTION)
      .on(TT_TLD, S_MENTION)
      .on(TT_NUM, S_MENTION);

    // More valid mentions
    S_MENTION
      .on(TT_DOMAIN, S_MENTION)
      .on(TT_LOCALHOST, S_MENTION)
      .on(TT_TLD, S_MENTION)
      .on(TT_NUM, S_MENTION)
      .on(TT_UNDERSCORE, S_MENTION);

    // Mention with a divider
    S_MENTION
      .on(TT_SLASH, S_MENTION_DIVIDER)
      .on(TT_DOT, S_MENTION_DIVIDER)
      .on(TT_AT, S_MENTION_DIVIDER);

    // Mention _ trailing stash plus syms
    S_MENTION_DIVIDER.on(TT_UNDERSCORE, S_MENTION_DIVIDER_SYMS);
    S_MENTION_DIVIDER_SYMS.on(TT_UNDERSCORE, S_MENTION_DIVIDER_SYMS);

    // Once we get a word token, mentions can start up again
    S_MENTION_DIVIDER
      .on(TT_DOMAIN, S_MENTION)
      .on(TT_LOCALHOST, S_MENTION)
      .on(TT_TLD, S_MENTION)
      .on(TT_NUM, S_MENTION);

    S_MENTION_DIVIDER_SYMS
      .on(TT_DOMAIN, S_MENTION)
      .on(TT_LOCALHOST, S_MENTION)
      .on(TT_TLD, S_MENTION)
      .on(TT_NUM, S_MENTION);
  }
}

export const mention = new MentionPlugin();
