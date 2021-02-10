import { Options as IOptions } from 'linkifyjs';
import * as _scanner from './overrite/scanner';
export * from './overrite/options';
import { Options as OptionsClass } from './overrite/options';
import { LinkifyPluginManager } from './plugins';

// @ts-ignore
import { inherits as _inherits } from 'linkifyjs/lib/linkify/utils/class';

// @ts-ignore
import * as _parser from 'linkifyjs/lib/linkify/core/parser';

export interface IOptionsData<EXTRA = any> extends IOptions {
  ignoreTags?: string[];
  linkWrapper?: React.FC<{
    options: IOptionsData<EXTRA>;
    key: string;
    href: string;
    className?: string;
    target?: string;
    [key: string]: any;
  }>;
  extra?: EXTRA;
}

export class Options<EXTRA = any> extends OptionsClass {

  options: IOptionsData<EXTRA> = {};

  extra?: EXTRA;

  constructor(options: IOptionsData<EXTRA>) {
    super(options);
    this.options = options;
    this.extra = options.extra;
  }

  check(token: IMultiToken): boolean {
    return super.check(token);
  }

  resolve(token: IMultiToken): { [key: string]: any } {
    return super.resolve(token);
  }
}
export declare const OptionsDefaults: IOptionsData;

export function createOptions<EXTRA = any>(data: IOptionsData<EXTRA>): Options<EXTRA> & IOptionsData<EXTRA> {
  return new Options(data);
}

export interface IMultiToken {
  v: Array<{ v: string }>;
  isLink: boolean;
  type: 'token' | 'email' | 'text' | 'nl' | 'url';
}

export namespace LinkifyCore {
  export const tokenize = (str: string): IMultiToken[] => {
    return parser.run(scanner.run(str));
  }

  export const scanner = _scanner;
  export const parser = _parser;
  export const inherits: (parent: object, child: object, props?: any) => object = _inherits;

  export const PluginManager = LinkifyPluginManager;

  export const addCharsSupport = (stringOrReg: string | string[] | RegExp) => {
    const { S_DOMAIN, S_NUM, start, domainStates } = scanner;
    S_DOMAIN.on(stringOrReg, S_DOMAIN);
    start.on(stringOrReg, S_DOMAIN);

    LinkifyPluginManager.Plugins.hashtag.initAdpters.push((init) => {
      S_NUM.on(stringOrReg, S_NUM);
      return init;
    });

    for (const domainState of domainStates) {
      domainState.on(stringOrReg, S_DOMAIN);
    }
  }
}

export type LinkifyCoreType = typeof LinkifyCore;
