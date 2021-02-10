import { mention } from './Mention';
import { hashtag } from './Hashtag';
import { ticket } from './Ticket';
import { LinkifyCore } from '../Core';
import { BasePlugin } from './Base';

export namespace LinkifyPluginManager {
  export function enableMention() {
    addPlugin(mention);
  }

  export function enableHashtag() {
    addPlugin(hashtag);
  }

  export function enableTicket() {
    addPlugin(ticket);
  }

  export function addPlugin(plugin: BasePlugin) {
    plugin.enable(LinkifyCore);
  }

  export const Plugins = {
    mention,
    hashtag,
    ticket,
  };
}
