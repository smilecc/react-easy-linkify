/**
  Quick Hashtag parser plugin for linkify
*/

import { LinkifyCoreType } from '@/Core';
import { BasePlugin } from './Base';
import { IBaseState } from '../overrite/scanner';

export interface TicketPluginInit {
  S_HASH: IBaseState;
  S_TICKET: IBaseState;
}

export class TicketPlugin extends BasePlugin<TicketPluginInit> {
  init(linkify: LinkifyCoreType) {
    const TT = linkify.scanner.TOKENS; // Text tokens
    const S_START = linkify.parser.start;

    return {
      S_HASH: S_START.jump(TT.POUND),
      S_TICKET: new linkify.parser.State(this.StateStorage),
    };
  }

  startEnable(linkify: LinkifyCoreType, inited: TicketPluginInit): void {
    const TT = linkify.scanner.TOKENS; // Text tokens
    const MultiToken = linkify.parser.TOKENS.Base;

    linkify.inherits(MultiToken, this.StateStorage, {
      type: 'ticket',
      isLink: true
    });

    const {
      S_HASH,
      S_TICKET,
    } = inited;

    S_HASH.on(TT.NUM, S_TICKET);
  }
}

export const ticket = new TicketPlugin();
