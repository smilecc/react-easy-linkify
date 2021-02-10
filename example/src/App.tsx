import React from 'react';
import './App.css';
import { Linkify, LinkifyCore } from 'react-easy-linkify';

// The RegExp is char sets of Chinese, Japanese and Korean
LinkifyCore.addCharsSupport(/[\u2E80-\u9FFF]/);

// Advanced: You can inject or change something before the plugins enabled.
LinkifyCore.PluginManager.Plugins.hashtag.initAdpters.push((init, linkify) => {
  console.log(init);
  console.log(linkify);
  return init;
});

// Enable the plugins
LinkifyCore.PluginManager.enableMention();
LinkifyCore.PluginManager.enableHashtag();
LinkifyCore.PluginManager.enableTicket();

const App: React.FC = () => {
  return (
    <div className="App">
      <Linkify options={{
        className: "link",
        nl2br: true,
        formatHref: {
          mention: (href) => '/user' + href,
          hashtag: (href) => '/tag' + href.substring(1),
        }
      }}>
        <h2>Source Code</h2>
        This page's source code: {'\n'}
        https://github.com/smilecc/react-easy-linkify/blob/main/example/src/App.tsx

        <h2>Url Example</h2>
        google.com {'\n'}
        https://google.com {'\n'}
        https://google.com/search?q=hello你好 {'\n'}

        <h2>Mention Example</h2>
        @hello @hello123 @123hello @1a{'\n'}
        <h4>Chinese</h4>
        @hello你好 @h你好h @123你好123 @1你好1a {'\n'}
        @a1哈bc你好99abc
        <h4>Japanese</h4>
        @こんにちは @helloこんにちは @123こんにちは @こんにちは123
        @a你好

        <h2>Hashtag Example</h2>
        #hello #123hello #hello123 #1a  #1233 {'\n'}
        <h4>Chinese</h4>
        #a你好 #hello你好 #你好hello #a1哈bc你好99abc #1你好1
        <h4>Japanese</h4>
        #こんにちは #helloこんにちは #こんにちは123hello #123こんにちは

        <h2>Ticket Example</h2>
        &123 &123456789 {'\n'}
        &你好 &abc &a1 &123a
      </Linkify>
    </div>
  );
}

export default App;
