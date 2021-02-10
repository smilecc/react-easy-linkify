import { LinkifyCoreType } from '@/Core';
import { BasePlugin } from './Base';
import { IBaseState } from '../overrite/scanner';

export interface HashtagPluginInit {
  S_HASH: IBaseState;
  S_HASHTAG: IBaseState;
}

export class HashtagPlugin extends BasePlugin<HashtagPluginInit> {
  init(linkify: LinkifyCoreType) {
    const TT = linkify.scanner.TOKENS; // Text tokens
    const S_START = linkify.parser.start;

    return {
      S_HASH: S_START.jump(TT.POUND),
      S_HASHTAG: new linkify.parser.State(this.StateStorage),
    };
  }

  startEnable(linkify: LinkifyCoreType, inited: HashtagPluginInit): void {
    const TT = linkify.scanner.TOKENS; // Text tokens
    const MultiToken = linkify.parser.TOKENS.Base;

    linkify.inherits(MultiToken, this.StateStorage, {
      type: 'hashtag',
      isLink: true
    });

    const {
      S_HASH,
      S_HASHTAG,
    } = inited;

    S_HASH.on(TT.DOMAIN, S_HASHTAG);
    S_HASH.on(TT.TLD, S_HASHTAG);
    S_HASH.on(TT.LOCALHOST, S_HASHTAG);
  }
}

export const hashtag = new HashtagPlugin();
