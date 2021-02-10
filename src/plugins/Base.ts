import { LinkifyCore, LinkifyCoreType } from '../Core';

export type PluginHandlerValue = string | { v: string | string[] }[];

export function createStateStorage(name: string = 'DEFAULT') {
  return function (value: string) {
    // @ts-ignore
    this.name = name;
    // @ts-ignore
    this.v = value;
  }
}

type PluginInitAdpter<INIT> = (init: INIT, linkify: LinkifyCoreType) => INIT;

export abstract class BasePlugin<INIT = any> {
  constructor() {
    this.StateStorage = createStateStorage();
  }

  StateStorage: (value: string) => void;

  enable(linkify: LinkifyCoreType) {
    let inited = this.init(linkify);
    for (const adpter of this.initAdpters) {
      inited = adpter(inited, linkify);
    }
    this.startEnable(linkify, inited);
  }

  abstract init(linkify: LinkifyCoreType): INIT
  abstract startEnable(linkify: LinkifyCoreType, inited: INIT): void

  initAdpters: PluginInitAdpter<INIT>[] = [];

}
