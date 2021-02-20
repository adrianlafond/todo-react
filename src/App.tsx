import React from 'react';

import { TodoItem, CompleteChangeEvent } from './components/todo-item';
import './app.css';

interface ItemsState { [key: string]: { complete: boolean }};

function App() {
  const [items, setItems] = React.useState<ItemsState>({});

  function onCompleteChange({ id, complete }: CompleteChangeEvent) {
    setItems({ ...items, [id]: { complete } });
  }

  return (
    <main className="app">
      <TodoItem id="item0" complete={items['item0'] && items['item0'].complete} onCompleteChange={onCompleteChange} />
    </main>
  );
}

export default App;
