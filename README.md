# React Easy Linify

React Easy Linify is a Component of React for finding URL/mentions/hashtags and converting them to Links.

This package is based on [Linkifyjs](https://github.com/Soapbox/linkifyjs). I rewrote its `scanner`, React Component, and Plugin Module, make them more flexible.

**Very importantly**, I made it be supported i18n. You can customize extended characters.

## Index

- [Demo](#demo)
- [Installation](#installation)

## Demo

[Open Demo](https://smilecc.github.io/react-easy-linkify/example/build/)


## Installation

NPM
```bash
npm I react-easy-linkify
```

Or Yarn
```bash
yarn add react-easy-linkify
```

## Usage

### Quick Start

Import the `Linkify` component from `react-easy-linkify`, and just use it to wrap your elements.

```tsx
import React from 'react';
import './App.css';
import { Linkify } from 'react-easy-linkify';

const App: React.FC = () => {
  return (
    <div className="App">
      <Linkify>
        google.com
        https://google.com
        https://google.com/search?q=hello你好
      </Linkify>
    </div>
  );
}

export default App;
```

### Options

##### Usage

```tsx
const App: React.FC = () => {
  return (
    <div className="App">
      <Linkify options={{ className: 'test' }}>
        google.com
        https://google.com
        https://google.com/search?q=hello你好
      </Linkify>
    </div>
  );
}
```

The options extend from `Linkifyjs`'s options, currently, they all work properly.

You can check them at [Linkifyjs Options](https://github.com/Soapbox/linkifyjs/blob/gh-pages/docs/options.md).

The following mainly introduces the newly added and important option items in this library.

##### `formatHref`

**Type**: `formatHref?: ((href: string, type: LinkEntityType) => string) | Partial<Record<LinkEntityType, (href: string) => string>> | null;`

This is useful when finding hashtags and mentions. By `formatHref`, You can change the default `href` of `<a>`.

Useage:

```tsx
<Linkify
  options={{
    formatHref: {
      mention: (href) => '/user' + href,
      hashtag: (href) => '/tag' + href.substring(1),
    }
  }}
></Linkfiy>
```

The `LinkEntityType` type has values of `url`, `email`, `hashtag`, and `mention`.

##### `format`

**Type**: `format?: ((value: string, type: LinkEntityType) => string) | Partial<Record<LinkEntityType, (value: string) => string>> | null;`

Like `formatHref`, Format the text displayed. e.g... cutoff a long URL.

```tsx
<Linkify
  options={{
    format: {
      url: (value) => value.substr(0, 20),
    }
  }}
></Linkfiy>
```

##### `linkWrapper`

When you need to customize the elements of the link, or You want to add some element in the link's parent. It's very useful.

Option's `attributes`, `className` is all of HTML element's attribute, not React node's props.

By this param, It can replace most other params (e.g... `attributes`, `className`, `target`), And make it programable.

**Type**
```ts
linkWrapper?: React.FC<{
  options: IOptionsData<EXTRA>;
  key: string;
  href: string;
  className?: string;
  target?: string | ((href: string, type: LinkEntityType) => string) | Partial<Record<LinkEntityType, string | null>>;
  [key: string]: any;
}>;
```

Useage:

```tsx
const App: React.FC = () => {
  return (
    <div className="App">
      <Linkify options={{
        className: 'test',
        linkWrapper: (props) => (
          <div className='wrapper'>
            <a {...props}>{props.children}</a>
          </div>
        ),
      }}
      >
        google.com
        https://google.com
        https://google.com/search?q=hello你好
      </Linkify>
    </div>
  );
}
```


### Plugins

The package build-in three plugins:

- Mention (start with `@`)
- Hashtag (start with `#`)
- Ticket (start with `&`)

You can find and enable them by `LinkifyCore.PluginManager`.

If you want to change them, `LinkifyCore.PluginManager` provided the original objects of them.

#### Mention Plugin

To enable the Mention plugin, you just should call `LinkifyCore.PluginManager.enableMention()`.

```tsx
import React from 'react';
import './App.css';
import { Linkify, LinkifyCore } from 'react-easy-linkify';

LinkifyCore.PluginManager.enableMention();

const App: React.FC = () => {
  return (
    <div className="App">
      <Linkify>
        @hello @username1 @123hello
      </Linkify>
    </div>
  );
}

export default App;
```

#### Hashtag Plugin

Like the mention plugin:

```tsx
import React from 'react';
import './App.css';
import { Linkify, LinkifyCore } from 'react-easy-linkify';

LinkifyCore.PluginManager.enableHashtag();

const App: React.FC = () => {
  return (
    <div className="App">
      <Linkify>
        #hello #username1 #123hello
      </Linkify>
    </div>
  );
}

export default App;
```

#### Ticket Plugin

The ticket only includes numbers, it's away used in issue or work order.

**Tips** In the `Linkifyjs`, the Ticket was started with `#`. But when it exists with `hashtag` and `i18n`, sometimes has been mistakes.

So I fixed it. In this package, the Ticket was starting with `&`;

```tsx
import React from 'react';
import './App.css';
import { Linkify, LinkifyCore } from 'react-easy-linkify';

LinkifyCore.PluginManager.enableTicket();

const App: React.FC = () => {
  return (
    <div className="App">
      <Linkify>
        #hello #username1 #123hello
      </Linkify>
    </div>
  );
}

export default App;
```

### i18n

The i18n is only needed for Mention and Hashtag. It's not necessary for i18n. If you don't use Mention or Hashtag, maybe you also don't need i18n.

Firstly, You should find the RegExp of the charset of your language or any you're needed.

Then you can call the method of `LinkifyCore.addCharsSupport` to support the language you need.

```tsx
LinkifyCore.addCharsSupport(/[\u2E80-\u9FFF]/);
```

## Advanced Usage

The `linkify`'s core is an FSM(finite-state machine), It's work through action and state transfer.

In the original package, it only exported the entry point of the state machine.

So, it's so difficult to modify somethings. But now, in this package, I export many important variables from `scanner`, and rewrite the plugin module.

You can read the code of this library, I will supplement this part of the document as soon as possible.

### Plugin Module

TODO

### State Machine

TODO

## License

MIT

## Contributing

PR and issue are welcome.
