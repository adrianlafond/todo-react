import React from 'react';

import { TodoItem, CompleteChangeEvent } from './components/todo-item';
import { TodoAddItem } from './components/todo-add-item';
import './app.css';

interface ItemsState { [key: string]: { complete: boolean }};

function App() {
  const [items, setItems] = React.useState<ItemsState>({});

  function onCompleteChange({ id, complete }: CompleteChangeEvent) {
    setItems({ ...items, [id]: { complete } });
  }

  function onAddItem() {
    console.log('add');
  }

  return (
    <main className="app">
      <TodoItem id="item0" complete={items['item0'] && items['item0'].complete} onCompleteChange={onCompleteChange}>
        Text
      </TodoItem>
      <TodoItem id="item1" complete={items['item1'] && items['item1'].complete} onCompleteChange={onCompleteChange}>
        Hello, world
      </TodoItem>
      <TodoAddItem onAdd={onAddItem} />
    </main>
  );
}

export default App;
