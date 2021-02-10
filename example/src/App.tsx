import React from 'react';
import './App.css';
import { Linkify, LinkifyCore } from '../../dist';

LinkifyCore.PluginManager.Plugins.mention.initAdpters.push((init, linkify) => {
  console.log(init);
  return init;
});
LinkifyCore.PluginManager.enableMention();
LinkifyCore.PluginManager.enableHashtag();
LinkifyCore.addCharsSupport(/[\u2E80-\u9FFF]/);
console.log(LinkifyCore.scanner);

const App: React.FC = () => {
  return (
    <div className="App">
      <Linkify options={{ className: "hello", nl2br: true }}>
        google.com {'\n'} @hello @你好 #你好 #hello你好 #你好hello @a1哈bc你好99abc
      </Linkify>
    </div>
  );
}

export default App;
